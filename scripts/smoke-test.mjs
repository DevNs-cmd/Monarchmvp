const baseUrl = process.env.BASE_URL || "http://localhost:3000";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function json(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json().catch(() => ({}));
  return { response, body };
}

async function session(role) {
  const { response, body } = await json("/api/auth/demo-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  assert(response.ok, `${role} demo login failed: ${body.error || response.status}`);
  const cookie = response.headers.getSetCookie().map((value) => value.split(";", 1)[0]).join("; ");
  assert(cookie.includes("monarch_token="), `${role} session cookie missing`);
  return { Cookie: cookie };
}

async function get(path, headers) {
  const { response, body } = await json(path, { headers });
  assert(response.ok, `${path} failed: ${body.error || response.status}`);
  return body;
}

const landing = await fetch(baseUrl);
assert(landing.ok, "Landing page did not render");

const founderHeaders = await session("FOUNDER");
const founder = await get("/api/founder/overview", founderHeaders);
assert(founder.profile.companyName === "Nebula AI", "Founder demo data mismatch");
assert(founder.interests.length >= 2, "Founder interest workflow is not seeded");
assert((await get("/api/agreements", founderHeaders)).items.length === 3, "Founder agreements missing");
assert((await get("/api/payments", founderHeaders)).items.length >= 2, "Founder payment ledger missing");

const investorHeaders = await session("INVESTOR");
const investor = await get("/api/investor/overview", investorHeaders);
assert(investor.matches.length >= 3, "Investor matches missing");
assert((await get("/api/boardroom", investorHeaders)).items.length >= 3, "Boardroom dossiers missing");
const dealRooms = await get("/api/dealroom", investorHeaders);
assert(dealRooms.items.length >= 1, "Investor deal room missing");
assert((await get(`/api/dealroom/${dealRooms.items[0].id}/messages`, investorHeaders)).items.length >= 3, "Encrypted deal messages missing");

const adminHeaders = await session("ADMIN");
const operations = await get("/api/admin/operations", adminHeaders);
assert(operations.dealFlow.rows.length >= 1, "Admin deal operations missing");
assert(operations.governance.length >= 3, "Admin governance members missing");
assert((await get("/api/admin/overview", adminHeaders)).accessRequests.length >= 2, "Admin vetting queue missing");

console.log(JSON.stringify({
  status: "passed",
  founder: { company: founder.profile.companyName, interests: founder.interests.length },
  investor: { matches: investor.matches.length, dealRooms: dealRooms.items.length },
  admin: { deals: operations.dealFlow.rows.length, members: operations.governance.length },
}, null, 2));
