const request = require("supertest");

const server = require("./server");


describe("server.js", () => {
    describe("GET /", () => {
        it("should return a response of 200", async function(){
            const response = await request(server).get("/");

            expect(response.status).toBe(200);
        })
    })

    it('should respond with { api: "is Up" }', function() {
        return request(server)
          .get("/")
          .then(res => {
            expect(res.body.api).toBe("is Up");
          });
      });
})