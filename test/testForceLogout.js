const ioClient = require('socket.io-client');
const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');

const SERVER_URL = 'http://localhost:8080';
const client = ioClient(SERVER_URL); // 确保这是有效的服务器地址

// 测试完成后的清理函数
function cleanup() {
  if (client.connected) {
    client.disconnect(); // 确保仅当连接存在时才断开连接
  }
}

describe('Force Logout Test', function() {
  this.timeout(10000); // 增加超时时间以等待异步操作完成

  after(cleanup); // 测试完成后执行

  it('should receive forcedLogout event', function(done) {
    client.on('forcedLogout', function(data) {
      try {
        expect(data).to.be.an('object');
        expect(data).to.have.property('message');
        expect(data.message).to.equal('You have been forcefully logged out by an administrator');
        done();
      } catch (error) {
        done(error);
      }
    });

    // 模拟触发 forceLogout 逻辑
    const agent = supertest.agent(SERVER_URL); // 使用agent以保持会话状态
    agent
      .post('/logout/force-logout')
      .set('Content-Type', 'application/json')
      .set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcxNzY5MDkxNywiZXhwIjoxNzE3Njk0NTE3fQ.4ZkFLBHAsHTrVLQq2ihAIflWgNV-zSi6fu7exmfzhM0') // 替换为有效的JWT令牌
      .send({ user_id: 1 }) // 替换为实际的用户ID
      .expect(200, done); // 期望状态码为200
  });
});

