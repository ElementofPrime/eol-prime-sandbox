// Node 18+
import http from "node:http";
const endpoints = [
  "http://localhost:3000",
  "http://localhost:3000/chat",
  "http://localhost:3000/api/prime",
  "http://localhost:3000/api/journal"
];
function hit(url){
  return new Promise((resolve)=>{
    const req = http.get(url, (res)=> resolve({ url, status: res.statusCode }));
    req.on("error", ()=> resolve({ url, status: "ERR" }));
  });
}
const results = await Promise.all(endpoints.map(hit));
console.table(results);
process.exit(results.every(r => typeof r.status === "number" && r.status < 500) ? 0 : 1);
