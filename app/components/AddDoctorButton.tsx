"use client";
import axios from "axios";
import { useState } from "react";
import AddDoctorModal from "./AddDoctorModal";

export default function AddDoctorButton({ text }: { text: string }) {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const handleDropdownChange = (item: string) => {
    setSelectedValue(item);
  };
  
  const [isConfigModalOpen, setConfigModalOpen] = useState<boolean>(false);
  const onClickHandler = () => {
    setConfigModalOpen(!isConfigModalOpen);
  };
  return (
    <>
      <div className="flex justify-end">
        <button onClick={onClickHandler} className=" mr-3  font-bold text-sm  ">
          {text}
        </button>
      </div>
      {isConfigModalOpen && (
        <AddDoctorModal
          closeModal={onClickHandler}
          label="Add Doctor"
          placeholder="Doctor's Name"
        />
      )}
    </>
  );
}
