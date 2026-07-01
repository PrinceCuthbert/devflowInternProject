import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

export default function OtpModal({ isOpen, onClose, onVerify }) {
  const [otp, setOtp] = useState("");
  const font = "Inter, system-ui, sans-serif";

  const handleComplete = () => {
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md fixed top-[15%] left-[50%] translate-x-[-50%] translate-y-0 data-[state=open]:animate-in data-[state=open]:slide-in-from-top-full duration-300"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: "20px",
          padding: "36px 32px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          fontFamily: font,
        }}
      >
        <DialogHeader style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          {/* Shield icon */}
          <div style={{
            width: "52px", height: "52px",
            borderRadius: "16px",
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "4px",
          }}>
            <svg width="24" height="24" fill="none" stroke="#16A34A" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>

          <DialogTitle style={{ fontSize: "20px", fontWeight: 600, color: "#111827", letterSpacing: "-0.01em", fontFamily: font }}>
            Enter Security Code
          </DialogTitle>
          <DialogDescription style={{ fontSize: "14px", color: "#6B7280", fontFamily: font, lineHeight: 1.5 }}>
            We've dispatched your 6-digit access token pin.
          </DialogDescription>
        </DialogHeader>

        {/* OTP Slots */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "28px 0" }}>
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup style={{ gap: "10px" }}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="otp-slot"
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "12px",
                    fontSize: "20px",
                    fontWeight: 600,
                    borderWidth: "2px",
                    color: "#16A34A",
                    fontFamily: font,
                  }}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Verify button */}
        <button
          onClick={handleComplete}
          disabled={otp.length !== 6}
          className="btn-primary"
          style={{ borderRadius: "12px" }}
        >
          Verify &amp; Authorize
        </button>

        {/* Back link */}
        <button
          onClick={onClose}
          style={{
            width: "100%",
            textAlign: "center",
            fontSize: "13px",
            fontWeight: 500,
            color: "#6B7280",
            marginTop: "16px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: font,
            transition: "color 150ms ease",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#374151"}
          onMouseLeave={e => e.currentTarget.style.color = "#6B7280"}
        >
          ← Back to Account Credentials
        </button>
      </DialogContent>
    </Dialog>
  );
}
