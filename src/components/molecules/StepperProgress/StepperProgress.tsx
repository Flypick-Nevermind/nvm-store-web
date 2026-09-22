'use client';

import { motion } from 'framer-motion';
import { TRACKING_STAGES } from '@/constants/stages';

interface StepperProgressProps {
  currentStage: 1 | 2 | 3 | 4 | 5;
}

export function StepperProgress({ currentStage }: StepperProgressProps) {
  return (
    <div className="w-full" aria-label="Status pengiriman">
      <ol className="relative flex flex-col gap-0">
        {TRACKING_STAGES.map((stage, idx) => {
          const stageNum = stage.id as 1 | 2 | 3 | 4 | 5;
          const isCompleted = stageNum < currentStage;
          const isActive    = stageNum === currentStage;
          const isPending   = stageNum > currentStage;

          return (
            <li key={stage.id} className="relative flex items-start gap-4 pb-6 last:pb-0">
              {/* Vertical line connector */}
              {idx < TRACKING_STAGES.length - 1 && (
                <div
                  className={[
                    'absolute left-[17px] top-9 w-0.5 h-full',
                    isCompleted ? 'bg-[#C74375]' : 'bg-[#C8C8C8]/60',
                  ].join(' ')}
                  aria-hidden="true"
                />
              )}

              {/* Stage dot */}
              <div className="relative flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full z-10">
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-9 h-9 rounded-full bg-[#C74375] flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l4 4 6-6" />
                    </svg>
                  </motion.div>
                )}

                {isActive && (
                  <div className="relative w-9 h-9 flex items-center justify-center">
                    {/* Pulse ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[#C74375]/20"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="w-9 h-9 rounded-full bg-[#C74375] flex items-center justify-center z-10">
                      <span className="text-base" aria-hidden="true">{stage.icon}</span>
                    </div>
                  </div>
                )}

                {isPending && (
                  <div className="w-9 h-9 rounded-full border-2 border-[#C8C8C8] bg-white flex items-center justify-center">
                    <span className="text-sm font-bold text-[#C8C8C8]">{stage.id}</span>
                  </div>
                )}
              </div>

              {/* Stage content */}
              <div className="flex-1 pt-1.5 pb-2">
                <p
                  className={[
                    'font-semibold text-sm leading-snug',
                    isActive    ? 'text-[#C74375]' :
                    isCompleted ? 'text-[#1A1A1A]' : 'text-[#C8C8C8]',
                  ].join(' ')}
                >
                  {stage.title}
                </p>
                {(isActive || isCompleted) && (
                  <p className="text-xs text-[#888] mt-0.5 leading-relaxed">
                    {stage.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
