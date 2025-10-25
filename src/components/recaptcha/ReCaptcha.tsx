'use client';

import ReCAPTCHA from 'react-google-recaptcha';
import { useRef } from 'react';

interface ReCaptchaProps {
  onVerify: (token: string | null) => void;
  onExpired?: () => void;
}

export default function ReCaptcha({ onVerify, onExpired }: ReCaptchaProps) {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    return null;
  }

  return (
    <div className="form__group">
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={siteKey}
        onChange={onVerify}
        onExpired={onExpired}
        theme="light"
      />
    </div>
  );
}