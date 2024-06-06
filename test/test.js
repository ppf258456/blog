const request = require('supertest'); // 用于发起HTTP请求
const app = require('../app'); // 引入你的Express应用

const api = request(app); // 初始化请求对象


// 动态导入Chai，这需要在支持ES模块的环境中运行
const chai = import('chai');

describe('Force Logout API Tests', function() {
  this.timeout(10000); // 增加超时时间以等待动态导入

  const validToken = 'Bearer ';
  const invalidToken = 'Bearer 11111';
  const nonAdminToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTcxNzY2OTUxOCwiZXhwIjoxNzE3NjczMTE4fQ.ddOE-hf7vlwEx4Opog2pqvBe7Ftec8yPIyJ8ecfBcvA';
  const userId = 5;
  const nonExistUserId = 999;

  before(async function() {
    // 等待Chai模块加载完成
    const chaiModule = await chai;
    this.expect = chaiModule.expect;
  });

  describe('POST /logout/force-logout/:userId', () => {
    it('should force logout a user successfully', (done) => {
      api.post(`/logout/force-logout/${userId}`)
        .set('Authorization', validToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          this.expect(res.body).to.have.property('message', 'User forced logout successful');
          done();
        });
    });
    it('should respond with 401 Unauthorized for invalid token', (done) => {
      api.post(`/logout/force-logout/${userId}`)
        .set('Authorization', invalidToken)
        .expect(401, done);
    });

    it('should respond with 403 Forbidden for non-admin user', (done) => {
      api.post(`/logout/force-logout/${userId}`)
        .set('Authorization', nonAdminToken)
        .expect(403, done);
    });

    it('should respond with 404 Not Found for non-existing user', (done) => {
      api.post(`/logout/force-logout/${nonExistUserId}`)
        .set('Authorization', validToken)
        .expect(404, done);
    });

    it('should respond with 500 Internal Server Error on server error', (done) => {
      // 这里需要模拟一个服务器错误的情况，例如返回一个故意的错误响应
      // 这取决于你的应用程序如何响应内部错误
      api.post(`/logout/force-logout/${userId}`)
        .set('Authorization', validToken)
        .expect(500, done);
    });
  });
});