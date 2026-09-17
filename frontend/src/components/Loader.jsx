const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-[#8b4513]" />

      <p className="animate-pulse text-sm font-medium text-[#6b4423]">
        {text}
      </p>
    </div>
  );
};

export default Loader;