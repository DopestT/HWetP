import React, { useState } from "react";
import { ArrowLeft, CheckCircle2, FileWarning, Flag, ShieldCheck } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import SonarCursor from "@/components/SonarCursor";
import WaterPlasma from "@/components/WaterPlasma";
import { submitContentReport, submitTakedownRequest } from "@/lib/api";

const SECTION_META = {
  age: { eyebrow: "18+ / Age assurance", title: "Adults only", intro: "HERWET is intended only for adults. Production age assurance will be selected and configured for the jurisdictions actually served.", icon: ShieldCheck },
  report: { eyebrow: "Trust & safety", title: "Report content", intro: "Flag content or behavior for review. Reports are designed to enter a moderation queue with evidence, timestamps, and escalation status.", icon: Flag },
  takedown: { eyebrow: "Rights & removal", title: "Takedown request", intro: "Use this path for copyright, consent, impersonation, privacy, or other removal requests. Production handling preserves evidence and routes urgent safety issues separately.", icon: FileWarning },
  privacy: { eyebrow: "Privacy", title: "Privacy notice", intro: "Favorites and watch history currently stay on the device. The launch privacy notice will describe actual account, analytics, advertising, moderation, and retention practices once those systems are connected.", icon: ShieldCheck },
  terms: { eyebrow: "Terms", title: "Terms of use", intro: "Production terms placeholder for HERWET. Final terms must match the business entity, jurisdictions, content model, hosting arrangement, and monetization used at launch.", icon: FileWarning },
};

export default function TrustSafety() {
  const { section = "report" } = useParams();
  const [params] = useSearchParams();
  const meta = SECTION_META[section] || SECTION_META.report;
  const Icon = meta.icon;

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-abyss text-seafoam sonar-cursor">
      <WaterPlasma intensity="soft" /><SonarCursor /><Nav />
      <main className="relative z-10 mx-auto max-w-[1200px] px-5 pb-20 pt-24 sm:px-6 md:px-12 md:pb-24 md:pt-32">
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-seafoam/45 transition hover:text-cyan"><ArrowLeft size={14} /> Back to HERWET</Link>
        <section className="mt-8"><div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-cyan/75"><Icon size={16} /> {meta.eyebrow}</div><h1 className="heading-display mt-4 text-[clamp(2.8rem,13vw,4.5rem)] text-seafoam md:text-7xl">{meta.title}</h1><p className="mt-5 max-w-3xl text-sm leading-relaxed text-seafoam/55 md:text-base">{meta.intro}</p></section>
        <div className="mt-10">{section === "report" && <ReportForm params={params} />}{section === "takedown" && <TakedownForm params={params} />}{section === "age" && <AgeContent />}{section === "privacy" && <PrivacyContent />}{section === "terms" && <TermsContent />}</div>
        <div className="mt-12 rounded-xl border border-cyan/15 bg-abyss/45 p-5 font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-seafoam/35 backdrop-blur-md">Pre-launch foundation. The API and database case model are wired, but operational staffing, notification delivery, evidence procedures, and final legal/compliance text must be finalized before launch.</div>
      </main>
      <div className="relative z-10"><Footer /></div>
    </div>
  );
}

function ReportForm({ params }) {
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const video = params.get("video") || "";
  const ref = params.get("ref") || "";

  const submit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    try {
      const response = await submitContentReport({
        contentReference: form.get("contentReference"),
        reason: form.get("reason"),
        details: form.get("details"),
        contactEmail: form.get("contactEmail") || "",
      });
      setResult(response);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") return <Success title="Report received" body={`Case ${result?.id || "created"}. The production review queue now has a durable record for this submission.`} />;

  return <form onSubmit={submit} className="glass-panel rounded-2xl p-5 sm:p-6 md:p-8"><div className="grid gap-5 md:grid-cols-2"><Field label="Content reference"><input name="contentReference" required defaultValue={ref || video} placeholder="Video ID or URL" className={inputClass} /></Field><Field label="Reason"><select name="reason" required className={inputClass} defaultValue=""><option value="" disabled>Select reason</option><option>Consent concern</option><option>Copyright concern</option><option>Impersonation</option><option>Illegal or prohibited content</option><option>Harassment or abuse</option><option>Other</option></select></Field></div><Field label="What should we know?" className="mt-5"><textarea name="details" required rows={6} className={inputClass} placeholder="Describe the issue and include useful context." /></Field><Field label="Email for follow-up (optional)" className="mt-5"><input name="contactEmail" type="email" className={inputClass} placeholder="you@example.com" /></Field>{status === "error" && <ErrorNotice /> }<button disabled={status === "sending"} className="mt-6 min-h-12 w-full rounded-xl border border-cyan/50 bg-cyan/10 px-6 py-3 font-heading text-xs uppercase tracking-[0.18em] text-cyan transition hover:bg-cyan hover:text-abyss disabled:cursor-wait disabled:opacity-50 sm:w-auto sm:rounded-full">{status === "sending" ? "Submitting…" : "Submit report"}</button></form>;
}

function TakedownForm({ params }) {
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const video = params.get("video") || "";

  const submit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    try {
      const response = await submitTakedownRequest({
        requestType: form.get("requestType"),
        contentReference: form.get("contentReference"),
        requesterName: form.get("requesterName"),
        contactEmail: form.get("contactEmail"),
        basis: form.get("basis"),
        attestedAccurate: form.get("attestedAccurate") === "on",
      });
      setResult(response);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") return <Success title="Request received" body={`Case ${result?.id || "created"}. The production rights-and-removal queue now has a durable record for this request.`} />;

  return <form onSubmit={submit} className="glass-panel rounded-2xl p-5 sm:p-6 md:p-8"><div className="grid gap-5 md:grid-cols-2"><Field label="Request type"><select name="requestType" required className={inputClass} defaultValue=""><option value="" disabled>Select request</option><option>Copyright / DMCA</option><option>Consent / intimate imagery</option><option>Identity / impersonation</option><option>Privacy</option><option>Other legal request</option></select></Field><Field label="Content URL or reference"><input name="contentReference" required defaultValue={video} className={inputClass} placeholder="URL or content ID" /></Field><Field label="Your name"><input name="requesterName" required className={inputClass} placeholder="Full name" /></Field><Field label="Contact email"><input name="contactEmail" required type="email" className={inputClass} placeholder="you@example.com" /></Field></div><Field label="Basis for the request" className="mt-5"><textarea name="basis" required rows={6} className={inputClass} placeholder="Describe your rights, relationship to the content, and requested action." /></Field><label className="mt-5 flex items-start gap-3 text-sm text-seafoam/55"><input name="attestedAccurate" required type="checkbox" className="mt-1" /><span>I confirm the information provided is accurate to the best of my knowledge.</span></label>{status === "error" && <ErrorNotice /> }<button disabled={status === "sending"} className="mt-6 min-h-12 w-full rounded-xl border border-cyan/50 bg-cyan/10 px-6 py-3 font-heading text-xs uppercase tracking-[0.18em] text-cyan transition hover:bg-cyan hover:text-abyss disabled:cursor-wait disabled:opacity-50 sm:w-auto sm:rounded-full">{status === "sending" ? "Submitting…" : "Submit request"}</button></form>;
}

function AgeContent() { return <ContentCards items={[["Access control", "The production site should apply the age-assurance method required for each served jurisdiction rather than relying only on a cosmetic 18+ modal."],["Minimize retained data", "Where possible, retain only the verification result or token needed to authorize access rather than unnecessary identity data."],["Re-check by jurisdiction", "Age-assurance requirements can change. Provider configuration and policy should be reviewed before launch and as laws change."]]} />; }
function PrivacyContent() { return <ContentCards items={[["Device storage", "Favorites and history currently use browser local storage and are not synced to an account."],["Production disclosures", "The launch notice should accurately cover account data, logs, analytics, advertising, moderation records, cookies, retention, processors, and user rights."],["Sensitive browsing context", "Production telemetry and personalization should use heightened privacy minimization because the service concerns adult content."]]} />; }
function TermsContent() { return <ContentCards items={[["Adults only", "Users must satisfy applicable minimum-age and age-assurance requirements for their location."],["Prohibited material", "The service must prohibit illegal content, non-consensual intimate material, exploitation, and content violating applicable rights."],["Removal and enforcement", "HERWET should be able to remove content, restrict accounts, preserve evidence, and cooperate with lawful processes when appropriate."],["Final legal text", "Replace this placeholder with terms tailored to the actual business entity, jurisdictions, content sources, payment model, and dispute framework before launch."]]} />; }
function ContentCards({ items }) { return <div className="grid gap-4 md:grid-cols-2">{items.map(([title, body]) => <div key={title} className="glass-panel rounded-xl p-6"><h2 className="font-heading text-xl font-bold uppercase tracking-[0.04em] text-seafoam">{title}</h2><p className="mt-3 text-sm leading-relaxed text-seafoam/50">{body}</p></div>)}</div>; }
function Success({ title, body }) { return <div className="glass-panel rounded-xl p-8 text-center"><CheckCircle2 className="mx-auto text-cyan" size={34} /><h2 className="heading-display mt-5 text-3xl text-seafoam">{title}</h2><p className="mx-auto mt-3 max-w-xl text-sm text-seafoam/50">{body}</p></div>; }
function ErrorNotice() { return <p className="mt-5 rounded-lg border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-100/80">The case service is not reachable yet. Your information was not submitted. Try again after the production API is online.</p>; }
function Field({ label, children, className = "" }) { return <label className={`block ${className}`}><span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.2em] text-seafoam/45">{label}</span>{children}</label>; }
const inputClass = "min-h-12 w-full rounded-xl border border-titanium/40 bg-abyss/55 px-4 py-3 text-base text-seafoam placeholder:text-seafoam/25 focus:border-cyan focus:outline-none sm:text-sm";
