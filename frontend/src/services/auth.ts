import { Voters } from "../data/voters";
import { GetVotes } from "./voteServices";

export function login(fname: string, lname: string) {
  const cleanFname = fname.trim();
  const cleanLname = lname.trim();

  if (!cleanFname || !cleanLname) {
    return {
      success: false,
      message: "กรุณากรอกชื่อและนามสกุลให้ครบ",
    };
  }

  const user = Voters.find(
    (v) =>
      v.fname.toLowerCase() === cleanFname.toLowerCase() &&
      v.lname.toLowerCase() === cleanLname.toLowerCase()
  );

  if (!user) {
    return {
      success: false,
      message: "ไม่พบข้อมูลผู้ใช้งานในระบบ",
    };
  }

  const votes = GetVotes();
  const hasVoted = votes.some((v) => v.voterId === user.id);

  if (hasVoted) {
    return {
      success: false,
      message: "already",
    };
  }

  return {
    success: true,
    user,
  };
}