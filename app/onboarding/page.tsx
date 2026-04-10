"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap, Check, Loader2, ArrowRight, SkipForward, Database, Users, MessageSquare, Mail } from "lucide-react";

const steps = [
  { id: 1, title: "Connect Data Source", desc: "Bring in product usage data from your analytics tools", icon: Database, providers: ["Segment", "Mixpanel", "Amplitude"] },
  { id: 2, title: "Connect CRM", desc: "Sync customer data and contract information", icon: Users, providers: ["HubSpot", "Salesforce"] },
  { id: 3, title: "Connect Support Tool", desc: "Monitor support ticket sentiment and volume", icon: MessageSquare, providers: ["Intercom", "Zendesk"] },
  { id: 4, title: "Connect Email", desc: "Enable AI to send personalized outreach", icon: Mail, providers: ["Gmail", "Outlook"] },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<Record<number, string>>({});

  const connectProvider = (provider: string) => {
    setConnecting(provider);
    setTimeout(() => {
      setConnected(prev => ({ ...prev, [currentStep]: provider }));
      setConnecting(null);
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/dashboard");
    }
  };

  const skip = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else router.push("/dashboard");
  };

  const step = steps[currentStep];
  const progress = ((currentStep + (connected[currentStep] ? 1 : 0)) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-base flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-bold">ContextIQ</span>
        </div>
        <button onClick={() => router.push("/dashboard")} className="text-text-muted text-sm hover:text-text-secondary transition-colors">Skip setup</button>
      </div>

      {/* Progress */}
      <div className="px-6 pt-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-text-muted">STEP {currentStep + 1} OF {steps.length}</span>
            <span className="text-xs font-mono text-text-muted">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-indigo rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-lg w-full text-center">
          <div className="w-14 h-14 rounded-xl bg-indigo/10 flex items-center justify-center mx-auto mb-6">
            <step.icon className="w-7 h-7 text-indigo" />
          </div>
          <h2 className="font-heading text-2xl font-bold mb-2">{step.title}</h2>
          <p className="text-text-secondary text-sm mb-8">{step.desc}</p>

          <div className="space-y-3 mb-8">
            {step.providers.map(provider => {
              const isConnected = connected[currentStep] === provider;
              const isConnecting = connecting === provider;
              return (
                <button
                  key={provider}
                  onClick={() => !isConnected && !isConnecting && connectProvider(provider)}
                  disabled={isConnected || isConnecting}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                    isConnected ? "border-emerald/30 bg-emerald/5 text-emerald" :
                    isConnecting ? "border-indigo/30 bg-indigo/5 text-indigo" :
                    "border-border bg-surface hover:border-border-light text-text-primary"
                  }`}
                >
                  <span>{provider}</span>
                  {isConnected ? <Check className="w-4 h-4" /> : isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4 text-text-muted" />}
                </button>
              );
            })}
          </div>

          {connecting && (
            <div className="flex items-center justify-center gap-2 text-sm text-indigo mb-6">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Syncing your data...</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-4">
            <button onClick={skip} className="flex items-center gap-1 text-text-muted text-sm hover:text-text-secondary transition-colors">
              <SkipForward className="w-4 h-4" /> Skip for now
            </button>
            {(connected[currentStep] || currentStep === steps.length - 1) && (
              <button onClick={nextStep} className="bg-indigo hover:bg-indigo-dark text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                {currentStep === steps.length - 1 ? "Go to Dashboard" : "Continue"} <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
