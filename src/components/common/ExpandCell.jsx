import { useState } from "react";

function ExpandCell({ answer }) {
  const [showFull, setShowFull] = useState(false);

  const toggleShow = () => setShowFull((prev) => !prev);

  if (!answer) return <p></p>;

  return (
    <p onClick={toggleShow} style={{ cursor: "pointer" }}>
      {showFull
        ? answer
        : answer.length > 70
          ? answer.slice(0, 70) + "..."
          : answer}
    </p>
  );
}

export default ExpandCell;
