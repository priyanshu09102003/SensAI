"use client";

import React from "react";
import MDEditor from "@uiw/react-md-editor";

const CoverLetterPreview = ({ content }) => {
  return (
    <div className="py-4 select-text">
      <MDEditor value={content} preview="preview" height={700} data-color-mode="dark" />
    </div>
  );
};

export default CoverLetterPreview;