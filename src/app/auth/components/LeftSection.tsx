import Logo from "@/assets/Logo";

const LeftSection = () => {
  return (
    <div className="h-40 md:h-auto md:w-1/2 bg-primary/5 relative overflow-hidden flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: "url('/authbg.svg')" }}
        aria-hidden="true"
      />
      
      <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center">
        <Logo className="h-20 w-20 mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome to Milaap</h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-xs">
          Connect with friends and family in real-time
        </p>
      </div>
    </div>
  );
};

export default LeftSection;