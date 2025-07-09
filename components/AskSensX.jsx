import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

/**
 * AskSensXButton.jsx
 *
 * - Draggable window (via framer‑motion `drag`)
 * - Minimise, maximise (fullscreen), and close controls
 * - Black icons, black title text ("Ask SensX")
 *
 * Drop into any page and render with:
 *   <AskSensXButton />
 */
export default function AskSensXButton() {
  // "closed"   → hidden
  // "open"     → default size
  // "minimized"→ header only
  // "fullscreen" → fills viewport
  const [view, setView] = useState("closed");

  const open = () => setView("open");
  const close = () => setView("closed");
  const minimize = () => setView("minimized");
  const maximize = () => setView("open");
  const fullscreen = () => setView("fullscreen");

  const isOpen = view === "open";
  const isMin = view === "minimized";
  const isFull = view === "fullscreen";

  return (
    <>
      {/* Trigger button */}
      <Button className="rounded-full cursor-pointer px-3 py-1.5" onClick={open}>
        <Image src="/SensX.svg" alt="SensX Logo" width={30} height={30} />
        Ask SensX
      </Button>

      {/* Floating chat window */}
      <AnimatePresence>
        {view !== "closed" && (
          <motion.div
            key="chat"
            drag
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 25 }}
            className={`fixed z-50 flex flex-col overflow-hidden bg-background shadow-2xl ${
                  isFull
                    ? "inset-0 h-screen w-screen rounded-none"
                    : "bottom-6 right-6 h-[32rem] w-[24rem] rounded-2xl"
                }`}
            style={{ cursor: isMin ? "default" : "move" }}
          >
            {/* Header */}
            <header className="flex items-center justify-between bg-primary/90 px-4 py-2">
              <span className="font-semibold text-black">Ask SensX</span>

              <div className="flex gap-2">
                {!isMin && !isFull && (
                  <Minus
                    className="h-4 w-4 cursor-pointer text-black opacity-90 transition-opacity hover:opacity-100"
                    onClick={minimize}
                  />
                )}

                {isFull ? (
                  <Minus
                    className="h-4 w-4 cursor-pointer text-black opacity-90 transition-opacity hover:opacity-100"
                    onClick={maximize}
                  />
                ) : (
                  <Maximize2
                    className="h-4 w-4 cursor-pointer text-black opacity-90 transition-opacity hover:opacity-100"
                    onClick={fullscreen}
                  />
                )}

                <X
                  className="h-4 w-4 cursor-pointer text-black opacity-90 transition-opacity hover:opacity-100"
                  onClick={close}
                />
              </div>
            </header>

            {/* Body */}
            {!isMin && (
              <iframe
                src="https://sensxbot.netlify.app/"
                title="SensX Chatbot"
                className="h-full w-full border-none bg-white"
              />
            )}
            {isMin && (
              <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                Chat minimized – drag or click maximise to reopen
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
