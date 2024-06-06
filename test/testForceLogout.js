const ioClient = require('socket.io-client');
const chai = require('chai');
const expect = chai.expect;

// 模拟服务器地址，请替换为你的服务器地址
const SERVER_URL = 'http://localhost:8080';
const client = ioClient(SERVER_URL);

// 测试完成后的清理函数
function cleanup() {
  client.disconnect();
}

describe('Force Logout Test', function() {
  this.timeout(5000); // 增加超时时间以等待异步操作完成

  after(cleanup); // 测试完成后执行

  it('should receive forcedLogout event', function(done) {
    // 监听 forcedLogout 事件
    client.on('forcedLogout', function(data) {
      try {
        // 断言事件数据符合预期
        expect(data).to.be.an('object');
        expect(data).to.have.property('message');
        expect(data.message).to.equal('You have been forcefully logged out by an administrator');
        done();
      } catch (error) {
        done(error);
      }
    });

    // 模拟触发 forceLogout 逻辑
    // 注意：这里需要你根据实际情况调整，以确保可以触发 forceLogout 接口
    // 例如，这里可以使用 supertest 发送一个 POST 请求到你的 forceLogout 接口
    const supertest = require('supertest');
    const request = supertest('http://localhost:8080');
    describe('Force Logout API Test', function() {
        it('should trigger forcedLogout event for a user', function(done) {
          // 准备请求体和headers
          const body = { "user_id": 1 };
          const headers = {
            'Content-Type': 'application/json', // 确保设置正确的Content-Type
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcxNzY4MjAwNywiZXhwIjoxNzE3Njg1NjA3fQ.o7j2UvOyu2p_BrlEIu641RifGpftP5x0W9wewxUzg_8' // 替换为你的实际token值
          };
           // 发送POST请求到forceLogout接口
    request.post('/logout/force-logout')
    .send(body) // 发送请求体
    .set(headers) // 设置headers
    .expect('Content-Type', /json/) // 期望响应的Content-Type是JSON
    .expect(200) // 期望状态码为200
    .end(function(err, res) {
      if (err) return done(err);
      // 这里可以添加更多的响应断言
      console.log(res.body);
      done();
    });
});
  });
});
});
// 运行测试
