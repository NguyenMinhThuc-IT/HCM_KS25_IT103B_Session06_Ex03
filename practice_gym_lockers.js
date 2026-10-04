let currentCardCode = "";
let currentMemberTier = "";
let isValidCard = false;

let currentBorrowedLog = "";
let hasBorrowedLog = false;

const PRICE_TABLE = {
  TOWEL: 20000,
  LOCK: 15000,
};

const DEPOSIT_FEE = 50000;

const testInputQueue = [
  { choice: 3 },
  { choice: 1, cardCode: "  gym-vip-2026  " },
  { choice: 2, borrowedLog: "TOWEL:2|LOCK:1" },
  { choice: 3 },
  { choice: 1, cardCode: "GYM-STANDARD-2026" },
  { choice: 2, borrowedLog: "TOWEL:1" },
  { choice: 3 },
  { choice: 4 },
];

let inputIndex = 0;

function getNextUserAction() {
  if (inputIndex < testInputQueue.length) {
    return testInputQueue[inputIndex++];
  }
  return { choice: 4 };
}

let isRunning = true;

do {
  const action = getNextUserAction();
  const choice = action.choice;

  switch (choice) {
    case 1: {
      console.log("\n================================================");
      console.log("[CHUC NANG 1] TIEP NHAN VA XAC THUC THE HOI VIEN");
      console.log("================================================");

      const rawCode = action.cardCode || "";
      const cleanedCode = rawCode.trim().toUpperCase();

      console.log(`Ma the nhap vao: "${cleanedCode}"`);

      if (cleanedCode.length < 8 || !cleanedCode.startsWith("GYM")) {
        console.log("LOI: Ma the khong hop le (Do dai < 8 hoac khong bat dau bang 'GYM').");
        isValidCard = false;
        currentCardCode = "";
        currentMemberTier = "";
      } else {
        isValidCard = true;
        currentCardCode = cleanedCode;

        if (cleanedCode.includes("VIP")) {
          currentMemberTier = "VIP";
        } else {
          currentMemberTier = "STANDARD";
        }

        currentBorrowedLog = "";
        hasBorrowedLog = false;

        console.log(`XAC NHAN: The hop le! Hang hoi vien: ${currentMemberTier}`);
      }
      break;
    }

    case 2: {
      console.log("\n================================================");
      console.log("[CHUC NANG 2] GHI NHAN CHUOI VAT TU MUON THEM");
      console.log("================================================");

      if (!isValidCard) {
        console.log("LOI: Chua xac thuc the hoi vien hop le.");
        console.log("Vui long chon Chuc nang 1 de quet the truoc khi ghi nhan vat tu.");
        break;
      }

      const logInput = (action.borrowedLog || "").trim().toUpperCase();

      if (logInput.length === 0) {
        console.log("LOI: Chuoi nhat ky vat tu khong duoc de rong.");
        break;
      }

      currentBorrowedLog = logInput;
      hasBorrowedLog = true;

      console.log(`Ghi nhan nhat ky vat tu muon: "${currentBorrowedLog}"`);
      break;
    }

    case 3: {
      console.log("\n================================================");
      console.log("[CHUC NANG 3] IN PHIEU BAN GIAO TU DO VA TINH PHI");
      console.log("================================================");

      if (!isValidCard) {
        console.log("LOI: Chua co thong tin the hoi vien hop le.");
        console.log("Vui long thuc hien Chuc nang 1 de xac thuc the truoc.");
        break;
      }

      let assignedZone = "";
      let freeTowelQty = 0;

      if (currentMemberTier === "VIP") {
        assignedZone = "ZONE-A";
        freeTowelQty = 1;
      } else {
        assignedZone = "ZONE-B";
        freeTowelQty = 0;
      }

      let totalTowelCount = 0;
      let totalLockCount = 0;

      if (hasBorrowedLog && currentBorrowedLog.length > 0) {
        let remainingLog = currentBorrowedLog;

        while (remainingLog.length > 0) {
          let segment = "";
          let pipeIndex = remainingLog.indexOf("|");

          if (pipeIndex !== -1) {
            segment = remainingLog.slice(0, pipeIndex);
            remainingLog = remainingLog.slice(pipeIndex + 1);
          } else {
            segment = remainingLog;
            remainingLog = "";
          }

          let colonIndex = segment.indexOf(":");
          if (colonIndex !== -1) {
            let itemKey = segment.slice(0, colonIndex).trim();
            let itemQty = Number(segment.slice(colonIndex + 1).trim()) || 0;

            if (itemKey === "TOWEL") {
              totalTowelCount += itemQty;
            } else if (itemKey === "LOCK") {
              totalLockCount += itemQty;
            }
          }
        }
      }

      let chargeableTowelCount = totalTowelCount - freeTowelQty;
      if (chargeableTowelCount < 0) {
        chargeableTowelCount = 0;
      }

      let towelFee = chargeableTowelCount * PRICE_TABLE.TOWEL;
      let lockFee = totalLockCount * PRICE_TABLE.LOCK;
      let totalItemFee = towelFee + lockFee;

      let depositFee = 0;
      if (totalTowelCount > 0 || totalLockCount > 0) {
        depositFee = DEPOSIT_FEE;
      }

      let grandTotal = totalItemFee + depositFee;

      const borderLine = "-".repeat(45);
      console.log(borderLine);
      console.log("       PHIEU BAN GIAO TU DO VA VAT TU      ");
      console.log(borderLine);
      console.log(` Ma the      : ${currentCardCode}`);
      console.log(` Hang the    : ${currentMemberTier}`);
      console.log(` Khu vuc tu  : ${assignedZone}`);
      console.log(borderLine);
      console.log(` Khan muyen mien phi (VIP) : ${freeTowelQty} chiec`);
      console.log(` Tong khan tam mieu       : ${totalTowelCount} chiec`);
      console.log(` Tong khoa tu mieu        : ${totalLockCount} chiec`);
      console.log(borderLine);
      console.log(` Tien khan tam tin phi   :${towelFee.toLocaleString("en-US").padStart(14)} VND`);
      console.log(` Tien khoa tu tin phi    :${lockFee.toLocaleString("en-US").padStart(14)} VND`);
      console.log(` Tien dat coc hoan tra    :${depositFee.toLocaleString("en-US").padStart(14)} VND`);
      console.log(borderLine);
      console.log(` TONG CONG PHI PHAT SINH  :${grandTotal.toLocaleString("en-US").padStart(14)} VND`);
      console.log(borderLine);

      isValidCard = false;
      currentCardCode = "";
      currentMemberTier = "";
      currentBorrowedLog = "";
      hasBorrowedLog = false;
      break;
    }

    case 4: {
      console.log("\n================================================");
      console.log("[CHUC NANG 4] DONG CA LAM VIEC VA THOAT");
      console.log("He thong quan ly tu do va vat tu da khieu dong.");
      console.log("================================================");
      isRunning = false;
      break;
    }

    default: {
      console.log("\nLUA CHON KHONG HOP LE!");
      console.log("Vui long chon mot trong cac chuc nang: 1, 2, 3 hoac 4.");
      break;
    }
  }
} while (isRunning);