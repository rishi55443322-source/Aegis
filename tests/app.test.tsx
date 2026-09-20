import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import React from 'react';
import App from '../src/App';
import { walletService } from '../src/services/walletService';
import { contractService } from '../src/services/contractService';

describe('Aegis Application Frontend & Integration Suite', () => {
  beforeEach(() => {
    walletService.disconnect();
    contractService.resetLedger();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the brand name Aegis, tagline, and launch button', () => {
    render(<App />);

    // Brand elements
    const aegisTitles = screen.getAllByText(/AEGIS/i);
    expect(aegisTitles.length).toBeGreaterThan(0);

    // Tagline in hero, header, footer
    const taglines = screen.getAllByText(/Guard the threshold/i);
    expect(taglines.length).toBeGreaterThan(0);

    // CTA buttons
    expect(screen.getByText(/Launch Verification Gate/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Connect Wallet/i })).toBeInTheDocument();
  });

  it('should open and close the Privacy Model selective disclosure modal', async () => {
    render(<App />);

    const privacyBtn = screen.getByRole('button', { name: /Privacy Model/i });
    fireEvent.click(privacyBtn);

    // Modal should be visible
    expect(screen.getByText(/How Aegis Stays Private/i)).toBeInTheDocument();
    expect(screen.getByText(/What An Observer CAN Learn/i)).toBeInTheDocument();
    expect(screen.getByText(/What Observer CANNOT Learn/i)).toBeInTheDocument();

    // Close button
    const closeBtn = screen.getByLabelText(/Close Modal/i);
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText(/How Aegis Stays Private/i)).not.toBeInTheDocument();
    });
  });

  it('should connect wallet and enable ZK proof generation form', async () => {
    render(<App />);

    // Open wallet modal
    const connectBtn = screen.getByRole('button', { name: /Connect Wallet/i });
    fireEvent.click(connectBtn);

    expect(screen.getByRole('heading', { name: /Midnight Wallet/i })).toBeInTheDocument();

    // Select Devnet Keypair
    const devnetBtn = screen.getByRole('button', { name: /Use Devnet Keypair/i });
    fireEvent.click(devnetBtn);

    // Should now be connected
    await waitFor(() => {
      expect(walletService.getState().isConnected).toBe(true);
    });

    // Verification button should now be enabled
    const submitBtn = screen.getByRole('button', { name: /Generate ZK Proof & Verify On-Chain/i });
    expect(submitBtn).not.toBeDisabled();
  });

  it('should execute end-to-end verification flow for eligible age (21 >= 18)', async () => {
    // Connect wallet first
    await walletService.connect(false);

    render(<App />);

    const ageInput = screen.getByLabelText(/Your Private Age/i);
    fireEvent.change(ageInput, { target: { value: '25' } });

    const submitBtn = screen.getByRole('button', { name: /Generate ZK Proof & Verify On-Chain/i });
    fireEvent.click(submitBtn);

    // Progress stage appears
    await waitFor(() => {
      expect(screen.getByText(/Synthesizing Zero-Knowledge Witness/i)).toBeInTheDocument();
    });

    // Successfully completes and shows ACCESS GRANTED
    await waitFor(
      () => {
        expect(screen.getByText(/ACCESS GRANTED/i)).toBeInTheDocument();
        expect(screen.getByText(/ELIGIBLE \(18\+\)/i)).toBeInTheDocument();
      },
      { timeout: 4000 }
    );
  });

  it('should execute end-to-end verification flow for ineligible age (16 < 18)', async () => {
    await walletService.connect(false);

    render(<App />);

    const ageInput = screen.getByLabelText(/Your Private Age/i);
    fireEvent.change(ageInput, { target: { value: '16' } });

    const submitBtn = screen.getByRole('button', { name: /Generate ZK Proof & Verify On-Chain/i });
    fireEvent.click(submitBtn);

    // Ineligible result ACCESS DENIED
    await waitFor(
      () => {
        expect(screen.getByText(/ACCESS DENIED/i)).toBeInTheDocument();
        expect(screen.getByText(/INELIGIBLE \(< 18\)/i)).toBeInTheDocument();
      },
      { timeout: 4000 }
    );
  });
});

// Integration test verifying wallet state transitions
