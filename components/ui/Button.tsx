type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl bg-lime-400 px-6 py-3 font-bold text-black transition hover:scale-105 active:scale-95"
    >
      {children}
    </button>
  );
}
