# Aegis: Zero-Knowledge Age & Eligibility Verification Protocol
## Product Proposal & Technical Specification
### Program: RiseIn "New Moon to Full: Monthly Moonshots on Midnight"
### Level: Level 3 - First Quarter Submission
### Author: rishi55443322-source
### Tagline: *"Guard the threshold. Guard the truth."*

---

## 1. Executive Summary

In today's hyper-connected yet fragmented digital economy, age verification has become one of the most contentious regulatory and technical battlegrounds. Governments worldwide are enacting stringent age-gating legislation (e.g., the UK Online Safety Act, the EU Digital Services Act, US state-level age verification laws) requiring digital platforms to restrict access to adult content, online gaming, financial derivatives, and age-restricted social media.

Simultaneously, data privacy laws (GDPR, CCPA) strictly penalize the over-collection and unauthorized exposure of personally identifiable information (PII). Current verification solutions create catastrophic compromises: users are forced to hand over driver's licenses, passports, or facial biometric scans to third-party verification brokers, transforming single authentication events into massive identity theft honey-pots.

**Aegis** is a privacy-first, decentralized Zero-Knowledge Age and Eligibility Gate built on the **Midnight blockchain** using the **Compact smart contract language**. Aegis empowers users to prove that their age satisfies a required threshold (e.g., $Age \ge 18$) with cryptographic certainty, **without ever revealing their date of birth, exact age, name, or legal identity** to the verifying application, network observers, or validators.

---

## 2. Problem Statement: The Triple Dilemma of Digital Verification

Current digital verification paradigms fail across three fundamental dimensions:

```
                  ┌─────────────────────────────────────┐
                  │    The Digital Verification Trilemma│
                  └──────────────────┬──────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌──────────────────┐       ┌──────────────────┐        ┌──────────────────┐
│  Over-Disclosure │       │ Centralized Risk │        │ Public Doxxing   │
│ Identity brokers │       │ Document data-   │        │ Public L1 chains │
│ collect full     │       │ bases become     │        │ leak transaction │
│ legal PII for    │       │ breach targets   │        │ history & balance│
│ boolean queries  │       │ & ransomware prey│        │ to surveillance  │
└──────────────────┘       └──────────────────┘        └──────────────────┘
```

1. **Over-Disclosure**: To verify whether a user is over 18, legacy systems collect full legal names, physical addresses, passport numbers, and biometric photos. A binary query ($isEligible \in \{0, 1\}$) results in full identity surrender.
2. **Centralized Honey-Pots**: Storing scanned government documents in centralized databases creates permanent liabilities. Data breaches at identity verification providers frequently expose millions of unredacted credentials.
3. **Public Blockchain Doxxing**: On transparent blockchains like Ethereum or Solana, storing identity credentials or proof events publicly links a user's wallet address to real-world metadata, enabling chain analysis heuristics to deanonymize users and map their transaction histories.

---

## 3. The Aegis Solution: Selective Disclosure on Midnight

Aegis solves this crisis by implementing **Midnight's dual-state architecture**:

- **Client-Side Witness Runtime (Private)**: The user's actual age or birthdate credential exists exclusively inside the user's local browser memory (`witness getPrivateAge()`). It is never broadcast, serialized into transaction logs, or transmitted to any server.
- **Zero-Knowledge Circuit (Arithmetic Constraints)**: The Compact circuit compiles the predicate:
  $$\text{Predicate}: \quad \text{privateAge} \ge \text{minimumAgeThreshold}$$
  The proving system produces a zk-SNARK proof that the user possesses a valid private witness satisfying this inequality, without revealing the witness value itself.
- **Public Ledger (Decentralized State)**: Midnight validators verify the validity of the proof against the public contract state. Upon consensus, the ledger records ONLY the caller's address, the boolean outcome (`isEligible: true`), the threshold tested (`18`), and a block timestamp.

---

## 4. Technical Architecture

### 4.1 System Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             AEGIS SYSTEM TOPOLOGY                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [User Device / Browser]                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 1. Input: Private Age (Local Witness Cell)                            │  │
│  │ 2. Lace Wallet: Provides signature & account authorization            │  │
│  │ 3. Client ZK Prover: Synthesizes R1CS constraints & blinding entropy   │  │
│  │ 4. Output: zk-SNARK Proof + Public Inputs (Raw Age Purged)            │  │
│  └──────────────────────────────────┬────────────────────────────────────┘  │
│                                     │                                       │
│                                     ▼ Transaction Payload                   │
│  [Midnight Blockchain Network]                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 1. Substrate Consensus Engine                                         │  │
│  │ 2. Compact Contract Runtime (aegis.compact)                           │  │
│  │    - Reads minimumAgeThreshold from Ledger                            │  │
│  │    - Validates Proof Commitment & Snark Points                        │  │
│  │    - Writes to verifications[caller]: VerificationRecord              │  │
│  │ 3. Public Query API: dApps query isEligible(address)                  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Compact Smart Contract Schema

The `aegis.compact` contract is structured as follows:

```compact
module Aegis {
  import CompactStandardLibrary;

  export ledger {
    admin: Cell<Address>,
    minimumAgeThreshold: Cell<Uint<32>>,
    verifications: Map<Address, VerificationRecord>,
    totalEligibleCount: Cell<Uint<64>>,
    protocolVersion: Cell<Uint<32>>
  }

  export struct VerificationRecord {
    isEligible: Boolean,
    thresholdTested: Uint<32>,
    timestamp: Uint<64>,
    proofCommitment: Bytes<32>
  }

  witness getPrivateAge(): Uint<32>;
  witness getUserAddress(): Address;
  witness getProofEntropy(): Bytes<32>;

  export circuit constructor(initialThreshold: Uint<32>): [] { ... }
  export circuit updateThreshold(newThreshold: Uint<32>): [] { ... }
  export circuit verifyAgeEligibility(): Boolean { ... }
  export circuit queryStatus(user: Address): VerificationRecord { ... }
}
```

---

## 5. Privacy Model & Threat Analysis

### 5.1 Selective Disclosure Table

| Information | Observer Visibility | Storage Location | Cryptographic Guarantee |
|---|---|---|---|
| **Raw Numeric Age** | ❌ Completely Hidden | Client Memory Only | Never serialized or transmitted |
| **Date of Birth** | ❌ Completely Hidden | None (Not used) | Excluded by design |
| **Distance to Threshold** | ❌ Completely Hidden | Client Circuit Only | Blinded by polynomial commitments |
| **Blinding Entropy** | ❌ Completely Hidden | Ephemeral RAM | Purged after proof generation |
| **Submitter Address** | ✅ Publicly Visible | Midnight Ledger | Public caller address |
| **Eligibility Flag** | ✅ Publicly Visible | Midnight Ledger | Verified boolean output |
| **Threshold Tested** | ✅ Publicly Visible | Midnight Ledger | Contract configuration cell |
| **Verification Timestamp** | ✅ Publicly Visible | Midnight Ledger | Substrate block timestamp |

### 5.2 Threat Model & Mitigations

1. **Replay Attacks**: An adversary intercepting an honest user's proof cannot replay it from another wallet, because the caller's address is bound into the proof commitment:
   $$\text{Commitment} = \mathcal{H}(\text{callerAddress} \parallel \text{entropy} \parallel \text{timestamp})$$
2. **Brute Force Age Deduction**: Because the output is strictly a boolean ($1$ or $0$), an observer learning that a user is $\ge 18$ learns zero bits of information regarding whether the user is 19, 35, or 65.
3. **Side-Channel Memory Leakage**: The client-side proving pipeline explicitly destroys witness references and blinding entropy once the proof points $(A, B, C)$ are computed.

---

## 6. User Experience & Neo-Brutalist Design Philosophy

To break free from generic hackathon themes (monotone dark-vault or generic light glassmorphism), Aegis introduces a **custom Neo-Brutalist design language**:

- **Visual Tone**: High-contrast, confident, raw typography using `Space Grotesk` and `JetBrains Mono`.
- **Borders & Shadows**: 3px–4px solid black borders (`#000000`) paired with hard offset drop-shadows with zero blur radius (`4px 4px 0px #000000`).
- **Color Hierarchy**: Saturated electric yellow (`#FFE600`) as primary action anchor, bold red (`#FF385C`) for constraints/errors, cobalt blue (`#2563EB`) for protocol state, and emerald green (`#00D664`) for verified states.
- **Physical Metaphors**:
  - *Charging Angular Shield*: Real-time progress bar reflecting cryptographic R1CS constraint compilation.
  - *Shield Slam-Shut*: Framer Motion spring physics visually slamming a heavy shield over the private witness input upon proof completion, symbolically and physically sealing the user's raw data.

---

## 7. Compliance & Regulatory Alignment

Aegis is architected to comply natively with global privacy and child protection frameworks:

- **GDPR Article 5(1)(c) (Data Minimization)**: Personal data must be adequate, relevant, and limited to what is necessary in relation to the purposes for which they are processed. Aegis achieves *absolute data minimization* by processing zero PII on-chain.
- **GDPR Article 25 (Data Protection by Design and by Default)**: Privacy is not an afterthought or toggle; the zero-knowledge mathematical circuit physically prevents age leakage.
- **COPPA & UK Age-Appropriate Design Code**: Enables service providers to enforce age gates for minors without acquiring parental tracking liability or retaining youth records.

---

## 8. Roadmap: Path to Level 4 (Waxing Gibbous)

```
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│   Level 3 (Current)    │      │  Level 4 (Gibbous)     │      │   Production Mainnet   │
├────────────────────────┤      ├────────────────────────┤      ├────────────────────────┤
│ ✔ Compact ZK Contract  │ ──►  │ • Compound Predicates  │ ──►  │ • Identity Provider VCs│
│ ✔ Dual Wallet Support  │      │ • Multi-Party Auth     │      │ • Mobile Lace App SDK  │
│ ✔ 13 Passing Tests     │      │ • Dynamic DAO Threshold│      │ • Audit by Top Security│
│ ✔ Neo-Brutalist UI     │      │ • Gasless Session Pass │      │ • Institutional Pilots │
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘
```

1. **Compound Attribute Predicates**: Expanding the circuit from single univariate inequalities ($Age \ge 18$) to multivariate compound predicates ($Age \ge 21 \land Jurisdiction \notin SanctionList$).
2. **W3C Verifiable Credential Oracle Ingestion**: Enabling users to ingest cryptographically signed government credentials into their local witness, proving validity without disclosing document numbers.
3. **Session Passkeys (Zero-Gas Querying)**: Minting ephemeral soulbound cryptographic passes on Midnight so dApps can query verification status off-chain without recurring gas expenses.

---

## 9. Conclusion

Aegis proves that compliance and privacy are not mutually exclusive. By uniting Midnight's selective disclosure ledger with high-speed client-side zero-knowledge arithmetic circuits, Aegis delivers a robust, submittable, and production-ready verification standard for the Web3 ecosystem.

*"Guard the threshold. Guard the truth."*

<!-- Section 1 & Section 7: Regulatory compliance alignment -->

<!-- Section 5.2: Replay attack defenses and Level 4 roadmap -->
