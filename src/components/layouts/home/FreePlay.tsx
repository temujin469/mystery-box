import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Calendar, CalendarDays } from "lucide-react";

function FreePlay() {
  const rakebackOptions = [
    {
      title: "Өдөр тутмын буцаалт",
      icon: Zap,
      gradient: "from-cyan-500 to-blue-600",
      bgGradient: "from-cyan-500/10 to-blue-600/10",
      borderColor: "border-cyan-500/20",
      iconColor: "text-cyan-400",
      glowColor: "shadow-cyan-500/30",
    },
    {
      title: "7 хоног тутмын буцаалт",
      icon: Calendar,
      gradient: "from-purple-500 to-violet-600",
      bgGradient: "from-purple-500/10 to-violet-600/10",
      borderColor: "border-purple-500/20",
      iconColor: "text-purple-400",
      glowColor: "shadow-purple-500/30",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 rounded-2xl p-8 border border-primary/20 mb-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.15),transparent_50%)]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-3xl"></div>

      {/* Floating Glowing Dots */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50"></div>
      <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-accent rounded-full animate-pulse delay-300 shadow-lg shadow-accent/50"></div>
      <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-primary rounded-full animate-pulse delay-700 shadow-lg shadow-primary/50"></div>
      <div className="absolute bottom-10 right-32 w-2 h-2 bg-accent rounded-full animate-pulse delay-1000 shadow-lg shadow-accent/50"></div>
      <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-primary rounded-full animate-pulse delay-500 shadow-md shadow-primary/40"></div>
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent rounded-full animate-pulse delay-1200 shadow-md shadow-accent/40"></div>
      <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse delay-800 shadow-lg shadow-primary/50"></div>

      {/* Additional floating particles with movement */}
      <div className="absolute top-16 left-1/3 w-1 h-1 bg-primary/60 rounded-full animate-bounce delay-200 shadow-sm shadow-primary/30"></div>
      <div className="absolute bottom-16 right-1/4 w-1 h-1 bg-accent/60 rounded-full animate-bounce delay-600 shadow-sm shadow-accent/30"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Left Content */}
        <div className="flex-1 max-w-lg">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            Үнэгүй тоглох
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
             Үнэгүй тоглох хуудсыг үзэж.
            үнэгүй тоглох аргуудыг олж мэдээрэй.
          </p>
          <Button className="group">
            Дэлгэрэнгүй үзэх
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>

        {/* Right Content - Rakeback Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 w-full lg:w-auto max-w-md lg:max-w-none">
          {rakebackOptions.map((option, index) => {
            const IconComponent = option.icon;

            return (
              <div
                key={option.title}
                className={`group relative bg-gradient-to-br ${option.bgGradient} backdrop-blur-sm border ${option.borderColor} rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer hover:border-primary/30`}
              >
                {/* Card glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                ></div>

                {/* Icon container with glass effect */}
                <div
                  className={`relative z-10 w-16 h-16 bg-gradient-to-br ${option.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg ${option.glowColor} backdrop-blur-sm border border-white/20 mx-auto`}
                >
                  {/* Glass inner glow */}
                  <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-lg"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 rounded-xl"></div>

                  <IconComponent
                    className="h-8 w-8 text-white relative z-10 drop-shadow-sm"
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(255,255,255,0.3))",
                    }}
                  />

                  {/* Lightning effect for daily */}
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1">
                      <Zap
                        className="h-4 w-4 text-yellow-300 animate-pulse drop-shadow-sm"
                        style={{
                          filter: "drop-shadow(0 0 4px rgba(255,255,0,0.5))",
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Card content */}
                <div className="relative z-10 text-center">
                  <h3 className="text-foreground font-bold text-lg mb-2 group-hover:text-foreground/90 transition-colors">
                    {option.title}
                  </h3>
                  
                  {/* Decorative line */}
                  <div className={`w-12 h-0.5 bg-gradient-to-r ${option.gradient} rounded-full mx-auto transition-all duration-300 shadow-sm group-hover:w-16`}></div>
                </div>

                {/* Hover shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${
                    index === 0 ? 'via-cyan-500/10' : 'via-purple-500/10'
                  } to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000`}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FreePlay;
