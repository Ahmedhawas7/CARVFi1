// Wallet integration for BackPack with CARV SVM Testnet
// Simplified implementation without heavy Solana dependencies

// CARV SVM Testnet RPC endpoint
export const CARV_RPC_URL = 'https://rpc.testnet.carv.io/rpc';

// Check if BackPack wallet is installed
export function isBackPackInstalled(): boolean {
  return typeof window !== 'undefined' && 'backpack' in window;
}

// Get BackPack provider
export function getBackPackProvider() {
  if (isBackPackInstalled()) {
    return (window as any).backpack;
  }
  return null;
}

// Connect to BackPack wallet
export async function connectBackPack(): Promise<{ publicKey: string; success: boolean; error?: string }> {
  try {
    const provider = getBackPackProvider();
    if (!provider) {
      return {
        publicKey: '',
        success: false,
        error: 'BackPack wallet not installed. Please install it from backpack.app'
      };
    }

    const resp = await provider.connect();
    return {
      publicKey: resp.publicKey.toString(),
      success: true
    };
  } catch (error: any) {
    return {
      publicKey: '',
      success: false,
      error: error.message || 'Failed to connect wallet'
    };
  }
}

// Disconnect wallet
export async function disconnectBackPack(): Promise<void> {
  try {
    const provider = getBackPackProvider();
    if (provider) {
      await provider.disconnect();
    }
  } catch (error) {
    console.error('Disconnect error:', error);
  }
}

// Create daily check-in transaction (minimal transaction for streak)
export async function createDailyCheckInTransaction(
  userPublicKey: string
): Promise<{ signature: string; success: boolean; error?: string }> {
  try {
    const provider = getBackPackProvider();
    if (!provider) {
      throw new Error('Wallet not connected');
    }

    // Create a simple message to sign as proof of daily check-in
    const message = `Daily Check-in: ${new Date().toISOString()}`;
    const encodedMessage = new TextEncoder().encode(message);

    // Sign the message
    const { signature } = await provider.signMessage(encodedMessage);
    
    // Convert signature to base58 string
    const signatureStr = btoa(String.fromCharCode(...new Uint8Array(signature)));

    return {
      signature: signatureStr,
      success: true
    };
  } catch (error: any) {
    console.error('Transaction error:', error);
    return {
      signature: '',
      success: false,
      error: error.message || 'Transaction failed'
    };
  }
}

// Get wallet balance (mock implementation)
export async function getWalletBalance(publicKey: string): Promise<number> {
  try {
    // In a real implementation, this would query the CARV SVM network
    // For MVP, return a mock balance
    return 0;
  } catch (error) {
    console.error('Balance error:', error);
    return 0;
  }
}

// Format wallet address for display
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
