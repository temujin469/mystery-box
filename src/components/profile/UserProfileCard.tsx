import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Info } from "lucide-react"

export function UserProfileCard() {
  return (
    <div className="bg-card text-muted-foreground flex-1 md:w-xs rounded-2xl shadow-xl p-6 space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 w-full">
        <div className="relative">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-cyan-400 border-4 border-cyan-400 flex items-center justify-center text-4xl font-semibold text-white">
            t
          </div>
          {/* Badge */}
          <div className="absolute bottom-0 right-0 w-7 h-7 bg-cyan-400 rounded-full border-2 border-background flex items-center justify-center text-white font-bold text-sm">
            1
          </div>
        </div>
        <div>
          <div className="font-semibold text-lg text-white leading-tight">
            temujin temujin
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            ID: 523472
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="w-full h-2 bg-muted-foreground/20 rounded-full mb-2">
          <div className="h-2 bg-cyan-400 rounded-full w-1/4"></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Level 1</span>
          <span>200 XP to level 2</span>
        </div>
      </div>

      <hr className="border-muted-foreground/20" />

      {/* Credits */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-base">Gaming Credit</span>
          <span className="font-bold text-base text-white">$0.00</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-base flex items-center gap-1">
            Withdrawable
            <Info className="w-4 h-4 opacity-50" />
          </span>
          <span className="font-bold text-base text-white">$0.00</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button className="w-full text-base font-medium rounded-lg py-6">Top-up</Button>
        <Button variant="outline" className="w-full text-base font-medium rounded-lg py-6 border-white text-white">Withdraw</Button>
      </div>

      {/* <hr className="border-muted-foreground/20" /> */}

      {/* Referrer Code */}
      {/* <div>
        <div className="font-semibold text-muted-foreground mb-2">Referrer code</div>
        <div className="flex gap-2">
          <Input className="flex-1 bg-muted border-0 text-white" value="googleen" readOnly />
          <Button className="rounded-lg px-5 font-medium">Update</Button>
        </div>
      </div> */}
    </div>
  )
}