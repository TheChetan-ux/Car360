function Button({
  children,
  className = "",
  variant = "primary",
  as: Component = "button",
  ...props
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500 text-white shadow-glow hover:scale-[1.02] hover:shadow-2xl",
    secondary: "border border-white/15 text-[color:var(--text)] hover:bg-white/5",
    ghost: "text-[color:var(--text)] hover:bg-white/10",
  };

  return (
    <Component
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Button;
