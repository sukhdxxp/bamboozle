"use client";

import React from "react";

export default function ImageUploadForm() {
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await fetch("/api/test/image", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log(data);
  };
  return (
    <div>
      <h1>Image Upload Form</h1>
      <form onSubmit={handleFormSubmit}>
        <input type="file" name="image" />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
