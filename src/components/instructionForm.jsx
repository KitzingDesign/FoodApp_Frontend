import { useState } from "react";

const InstructionForm = ({ addInstruction }) => {
  return (
    <div>
      <label htmlFor="instruction">Instruction:</label>
      <input
        type="text"
        id="instruction"
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
      />
    </div>
  );
};

export default InstructionForm;
