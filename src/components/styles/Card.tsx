interface CardProps {
  height: string;
  width: string;
  inner?: boolean;
  text?: string;
  children?: any;
  darker?: boolean;
}
export const Card = ({
  height,
  width,
  inner,
  text,
  children,
  darker,
}: CardProps) => {
  typeof inner === ("undefined" || "null") ? (inner = false) : (inner = true);
  return (
    <div
      style={{
        height: `${height}`,
        width: `${width}`,
        borderRadius: "15px",
        boxShadow: !inner ? "10px 10px 8px #888888" : "none",
        border: !inner ? "1px solid #B6B3A7" : "none",
        padding: !inner ? "20px" : "none",
        marginTop: "5vh",
        marginRight: "5vh",
        backgroundColor: darker ? "#D4D8C9" : "none",
        cursor: "pointer",
        color: text || "#000",
      }}
    >
      {children}
    </div>
  );
};
