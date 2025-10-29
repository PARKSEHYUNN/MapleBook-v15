// src/utils/passwordStrength.ts

const REGEX_REPEATED = /(.)\1{2,}/;
const REGEX_LOWER = /[a-z]/;
const REGEX_UPPER = /[A-Z]/;
const REGEX_NUMBER = /[0-9]/;
const REGEX_SPECIAL = /[^a-zA-Z0-9\s]/;

interface PasswordStrengthResult {
  score: number;
  level: "Low" | "Medium" | "High";
}

const isSequential = (password: string): boolean => {
  const sequences = [
    "012",
    "123",
    "234",
    "345",
    "456",
    "567",
    "678",
    "789",
    "987",
    "876",
    "765",
    "654",
    "543",
    "432",
    "321",
    "210",
    "abc",
    "bcd",
    "cde",
    "def",
    "efg",
    "fgh",
    "ghi",
    "hij",
    "ijk",
    "jkl",
    "klm",
    "lmn",
    "mno",
    "nop",
    "opq",
    "pqr",
    "qrs",
    "rst",
    "stu",
    "tuv",
    "uvw",
    "vwx",
    "wxy",
    "xyz",
    "zyx",
    "yxw",
    "xwv",
    "wvu",
    "vut",
    "uts",
    "tsr",
    "srq",
    "rqp",
    "qpo",
    "pon",
    "onm",
    "nml",
    "mlk",
    "lkj",
    "kji",
    "jih",
    "ihg",
    "hgf",
    "gfe",
    "fed",
    "edc",
    "dcb",
    "cba",
  ];

  const lowerCasePassword = password.toLowerCase();

  for (const seq of sequences) {
    if (lowerCasePassword.includes(seq)) {
      return true;
    }
  }

  return false;
};

export function checkPasswordStrength(
  password: string
): PasswordStrengthResult {
  let score = 0;
  const length = password.length;

  if (REGEX_LOWER.test(password)) score += 10;
  if (REGEX_UPPER.test(password)) score += 10;
  if (REGEX_NUMBER.test(password)) score += 10;
  if (REGEX_SPECIAL.test(password)) score += 10;

  if (length >= 8) score += 15;
  if (length >= 10) score += 10;
  if (length >= 12) score += 15;

  if (!REGEX_REPEATED.test(password)) {
    score += 10;
  }

  if (isSequential(password)) {
    score += 10;
  }

  let level: PasswordStrengthResult["level"];

  if (score >= 80) {
    level = "High";
  } else if (score >= 50) {
    level = "Medium";
  } else {
    level = "Low";
  }

  return { score, level };
}
