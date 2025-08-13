# Governance Proposal dApp

This is a simple decentralized application (dApp) that allows users to submit and view governance proposals. It features a Next.js frontend that interacts with a Solidity smart contract that is **live and deployed on the Sepolia testnet**.

## Features

- Connect to an Ethereum wallet (MetaMask).
- View a list of all submitted proposals from the live Sepolia contract.
- Create new proposals on the Sepolia network.
- A persistent connection state that remembers your wallet connection across the app.
- A simple, clean user interface.

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Ethers.js, Tailwind CSS
- **Smart Contract:** Solidity
- **Development Environment:** Foundry, Anvil

---

## Running the Live Demo

This project is pre-configured to connect to a smart contract already deployed on the Sepolia testnet. To run the application and interact with the live contract, follow these steps.

### Prerequisites for Live Demo

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [MetaMask](https://metamask.io/) browser extension

### Instructions

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run the Application**
    ```bash
    npm run dev
    ```

4.  **Using the Application**
    - **Step 1: Connect Your Wallet**
      - Open your browser to `http://localhost:3000`.
      - The first thing you will see is a "Connect Wallet" button. Click it.
      - Your MetaMask extension will pop up. It will ask you to approve the connection to the site. Click **Next** and then **Connect**.
      - *Important: Make sure your MetaMask is set to the **Sepolia** network.*

    - **Step 2: View Proposals**
      - Once connected, the page will display the list of current governance proposals read directly from the blockchain.

    - **Step 3: Create a Proposal**
      - Click the **"Create Proposal"** button to navigate to the submission form.
      - Fill in a title and description for your proposal.
      - Click **"Submit Proposal"**. MetaMask will pop up again, asking you to confirm the transaction. This will require a small amount of SepoliaETH for the gas fee.
      - Click **Confirm**. After the transaction is processed by the network (which can take 15-30 seconds), the application will automatically redirect you back to the main list, where your new proposal will now appear.

---

## For Developers: Local Development & Re-Deploying

If you want to modify the smart contract or deploy your own version, you will need to install [Foundry](https://getfoundry.sh/).

### Option A: Running Locally with Anvil

1.  **Start a Local Blockchain:** In a terminal, run `anvil`.
2.  **Deploy the Contract:** In a second terminal, run the deployment script, providing a private key from the Anvil output.
    ```bash
    PRIVATE_KEY=<YOUR_ANVIL_PRIVATE_KEY> forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast
    ```
3.  **Update Configuration:** The script will output a new contract address. Copy it and paste it into the `address` field in `contracts/Proposals.json`.
4.  **Run Frontend & Connect MetaMask:** Follow steps 3 and 4 from the "Live Demo" section, but configure MetaMask for your local Anvil network (RPC URL: `http://127.0.0.1:8545`, Chain ID: `31337`).

### Option B: Deploying Your Own Version to a Testnet

1.  **Get Prerequisites:** You need a wallet with testnet ETH and a personal RPC URL from a service like [Alchemy](https://www.alchemy.com).
2.  **Deploy:** Run the deployment script with your testnet RPC URL and private key.
    ```bash
    PRIVATE_KEY=<YOUR_TESTNET_PRIVATE_KEY> forge script script/Deploy.s.sol --rpc-url <YOUR_RPC_URL> --broadcast
    ```
3.  **Update Configuration:** Copy the new public contract address from the output and paste it into `contracts/Proposals.json`.
