"use client";

import { useState, useEffect } from "react";
import { Lock, Delete, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PinModalProps {
  isOpen: boolean;
  profileName: string;
  profileId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PinModal({
  isOpen,
  profileName,
  profileId,
  onSuccess,
  onCancel,
}: PinModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin("");
      setError(false);
      setIsVerifying(false);
    }
  }, [isOpen]);

  const verifyPin = async (enteredPin: string) => {
    if (enteredPin.length !== 4 || isVerifying) return;
    setIsVerifying(true);
    setError(false);

    try {
      const res = await fetch("/api/profiles/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: profileId, pin: enteredPin }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        setError(true);
        setTimeout(() => {
          setPin("");
          setError(false);
        }, 700);
      }
    } catch {
      setError(true);
      setTimeout(() => {
        setPin("");
        setError(false);
      }, 700);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDigit = (digit: string) => {
    setPin((prev) => {
      if (prev.length < 4) {
        const next = prev + digit;
        if (next.length === 4) {
          verifyPin(next);
        }
        return next;
      }
      return prev;
    });
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleDigit(e.key);
      } else if (e.key === "Backspace") {
        handleDelete();
      } else if (e.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, pin, isVerifying]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xs bg-white rounded-apple-lg shadow-apple-elevated p-6 flex flex-col items-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-apple-ink-muted-48 hover:text-apple-ink transition-colors p-1"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="w-12 h-12 rounded-full bg-apple-parchment flex items-center justify-center mb-3 text-apple-ink">
          <Lock className="h-6 w-6 text-apple-ink-muted-80" />
        </div>

        <h3 className="font-semibold text-apple-ink text-base">Enter PIN</h3>
        <p className="text-xs text-apple-ink-muted-80 mt-1 mb-5 text-center">
          Unlock <strong>{profileName}</strong>
        </p>

        {/* 4-digit PIN dots */}
        <motion.div
          animate={error ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4 mb-6"
        >
          {[0, 1, 2, 3].map((index) => {
            const filled = index < pin.length;
            return (
              <motion.div
                key={index}
                animate={{ scale: filled ? 1.15 : 1 }}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  error
                    ? "border-red-500 bg-red-500"
                    : filled
                    ? "border-apple-blue bg-apple-blue"
                    : "border-apple-divider bg-apple-parchment"
                }`}
              />
            );
          })}
        </motion.div>

        {error && (
          <p className="text-xs text-red-500 font-medium mb-3">
            Incorrect PIN. Try again.
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 w-full">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num)}
              className="h-12 rounded-apple bg-apple-parchment hover:bg-apple-pearl active:bg-apple-divider text-apple-ink text-lg font-semibold transition-colors flex items-center justify-center cursor-pointer select-none"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            type="button"
            onClick={() => handleDigit("0")}
            className="h-12 rounded-apple bg-apple-parchment hover:bg-apple-pearl active:bg-apple-divider text-apple-ink text-lg font-semibold transition-colors flex items-center justify-center cursor-pointer select-none"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-12 rounded-apple bg-apple-parchment hover:bg-apple-pearl active:bg-apple-divider text-apple-ink transition-colors flex items-center justify-center cursor-pointer select-none"
          >
            <Delete className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
