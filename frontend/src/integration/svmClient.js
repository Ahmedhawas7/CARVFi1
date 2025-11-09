import { Connection, Wallet, SVMClient } from "@carv/svm-sdk";

const connection = new Connection("https://testnet.carv.io");
const wallet = new Wallet(window.backpack);
export const svm = new SVMClient(connection, wallet);

export async function saveUserPoints(userId, points) {
  try {
    const tx = await svm.sendTransaction({
      instruction: "save_points",
      data: { userId, points },
    });
    await tx.confirm();
  } catch (error) {
    console.error("Error saving points:", error);
  }
}

export async function getUserPoints(userId) {
  try {
    const points = await svm.query({
      instruction: "get_points",
      data: { userId },
    });
    return points || 0;
  } catch (error) {
    console.error("Error getting points:", error);
    return 0;
  }
}
