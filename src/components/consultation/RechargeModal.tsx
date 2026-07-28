import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock } from "lucide-react";

interface RechargeModalProps {
  open: boolean;
  type: "warning" | "expired";
  onRecharge: () => void;
  onClose: () => void;
}

const RechargeModal = ({ open, type, onRecharge, onClose }: RechargeModalProps) => {
  const isWarning = type === "warning";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[hsl(16_32%_9%)] border-red-500/30 text-white max-w-sm mx-auto text-center">
        <div className="py-4 space-y-5">
          <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${isWarning ? "bg-yellow-500/20 border-2 border-yellow-400/50" : "bg-red-500/20 border-2 border-red-400/50"}`}>
            {isWarning ? (
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            ) : (
              <Clock className="w-8 h-8 text-red-400" />
            )}
          </div>

          {isWarning ? (
            <>
              <div>
                <h2 className="text-xl font-bold text-yellow-400">⚠️ Only 2 Minutes Remaining</h2>
                <p className="text-sm text-gray-400 mt-2">
                  Your consultation will end soon. Recharge now to continue talking with Pandit Ji.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-yellow-400/20">
                <p className="text-sm text-gray-300">Continue for 12 more minutes</p>
                <p className="text-2xl font-bold text-white mt-1">₹551</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1 border-white/20 text-gray-400 hover:bg-white/5">
                  Continue with current time
                </Button>
                <Button onClick={onRecharge} className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-bold">
                  Recharge ₹551
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-bold text-red-400">Your Consultation Has Ended</h2>
                <p className="text-gray-400 mt-2 text-sm">
                  Kya aapka koi topic reh gaya hai?
                </p>
                <p className="text-gray-400 text-sm">
                  Recharge karke dubara baat karein.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-red-400/20">
                <p className="text-sm text-gray-300">New 12 minute session</p>
                <p className="text-2xl font-bold text-white mt-1">₹551</p>
              </div>
              <Button onClick={onRecharge} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-bold py-3 text-base">
                Recharge ₹551
              </Button>
              <Button variant="ghost" onClick={onClose} className="w-full text-gray-500 hover:text-gray-300 text-sm">
                End Session
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RechargeModal;
