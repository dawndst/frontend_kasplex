import React, { useState, useRef, useEffect } from 'react';

import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { transfer } from '@/api/api';
import { TransferResponse } from '@/types/type';
import logo from '@/assets/LOGO1-1.png';

type ToastType = 'success' | 'error';

interface ToastState {
    type: ToastType;
    msg: string;
}

const Faucet: React.FC = () => {
    const [token, setToken] = useState('');
    const [address, setAddress] = useState('');
    const [btnLoading, setBtnLoading] = useState<boolean>(false);
    const [toast, setToast] = useState<ToastState | null>(null);
    const [tokenExpiry, setTokenExpiry] = useState<number>(0);
    const captchaRef = useRef<HCaptcha>(null);
    const expiritionTime = 120000;
    const tokenTime = useRef<NodeJS.Timeout | null>(null);
    const toastTime = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const script = document.createElement('script');
        script.src = 'https://js.hcaptcha.com/1/api.js?hl=en';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
            if (tokenTime.current) {
                clearTimeout(tokenTime.current);
            }
            if (toastTime.current) {
                clearTimeout(toastTime.current);
            }
        };
    }, []);

    const onVerify = (token: string) => {
        setToken(token);
        setTokenExpiry(Date.now() + expiritionTime);
        if (tokenTime.current) {
            clearTimeout(tokenTime.current);
        }
        tokenTime.current = setTimeout(() => {
            setToken('');
            setTokenExpiry(0);
        }, expiritionTime);
    };

    const openMsg = (type: ToastType, msg: string) => {
        if (toastTime.current) {
            clearTimeout(toastTime.current);
        }
        setToast({ type, msg });
        toastTime.current = setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    const sendFaucet = async () => {
        if (!address.trim()) return;
        if (!token || Date.now() > tokenExpiry) {
            openMsg('error', 'Please perform human-machine verification again');
            return;
        }
        setBtnLoading(true);
        try {
            const params = {
                address: address.trim(),
            };
            const res: TransferResponse = await transfer(params);
            if (res.msg) {
                if (res.msg.includes('Txhash')) {
                    openMsg('success', 'Successfully sent');
                    return;
                } else {
                    openMsg('error', res.msg);
                    return;
                }
            }
        } catch (error) {
            console.error('Error:', error);
            openMsg('error', 'Request failed, please try again later');
        } finally {
            setBtnLoading(false);
        }
    };

    return (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Toast / banner */}
            {toast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
                    <div
                        className={`glass-card rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl ${
                            toast.type === 'success'
                                ? 'border-primary/40 shadow-primary/10'
                                : 'border-error-red/40 shadow-error-red/10'
                        }`}
                        role="alert"
                    >
                        {toast.type === 'success' ? (
                            <CheckCircle2 size={18} className="text-primary shrink-0" />
                        ) : (
                            <AlertCircle size={18} className="text-error-red shrink-0" />
                        )}
                        <p className={`text-sm leading-snug ${toast.type === 'success' ? 'text-primary' : 'text-error-red'}`}>
                            {toast.msg}
                        </p>
                    </div>
                </div>
            )}

            <div className="max-w-3xl mx-auto space-y-8">
                {/* ------------------ Faucet panel ------------------ */}
                <div className="glass-card glow-cyan rounded-2xl overflow-hidden">
                    {/* Top bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-8 py-4 border-b border-outline-variant/40 bg-surface-container-low/40">
                        <div className="flex items-center gap-2.5">
                            <strong className="font-headline font-semibold text-xs uppercase tracking-wider text-outline">Powered by</strong>
                            <img className="h-5 sm:h-6 w-auto object-contain" src={logo} alt="kaspa logo" />
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg bg-secondary-container/30 border border-primary/25 font-mono text-[11px] text-primary-fixed transition-colors hover:border-primary/50 cursor-pointer">
                            Ethereum Sepolia
                        </button>
                    </div>

                    <div className="px-5 sm:px-8 py-8 sm:py-10 space-y-8">
                        <div className="text-center space-y-3">
                            <h2 className="font-headline font-black text-2xl sm:text-3xl md:text-4xl text-[#e2e2e2] tracking-tight">
                                KASPLEX-L2 TESTNET <span className="text-primary">FAUCET</span>
                            </h2>
                            <h5 className="font-mono text-xs sm:text-sm text-primary-fixed bg-secondary-container/30 border border-primary/15 rounded px-3 py-1 inline-block">
                                50 Bridged KAS/24 hrs
                            </h5>
                        </div>

                        <div className="space-y-5">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    placeholder="Enter Your Wallet Address (0x...)"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="flex-1 min-w-0 bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-sm font-mono text-[#e2e2e2] placeholder:text-outline/70 outline-none focus:border-primary transition-colors"
                                />
                                <button
                                    onClick={() => sendFaucet()}
                                    disabled={!address.trim() || btnLoading}
                                    className="px-6 py-3 bg-primary text-background hover:bg-secondary font-headline font-semibold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/15 active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap"
                                >
                                    {btnLoading && <Loader2 size={14} className="animate-spin" />}
                                    Send Me KAS
                                </button>
                            </div>

                            <div className="flex justify-center">
                                <HCaptcha
                                    sitekey="95807fea-7726-4e7a-97b0-6158a236bc5c"
                                    onVerify={onVerify}
                                    ref={captchaRef}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ------------------ FAQs ------------------ */}
                <div className="glass-card rounded-2xl p-5 sm:p-8 space-y-4">
                    <h6 className="font-headline font-bold text-xl text-[#e2e2e2]">
                        FAQ<span className="text-primary">s</span>
                    </h6>
                    <div className="space-y-3">
                        <h6 className="font-headline font-semibold text-sm text-secondary">How does it work?</h6>
                        <p className="text-xs sm:text-sm text-outline leading-relaxed">
                            You can request 2 Kasplex L2 KAS every 24h without any authentication. To request funds, enter your EOA wallet address and click 'Send Me KAS.' Smart contract addresses are not supported.
                        </p>
                        <p className="text-xs sm:text-sm text-outline leading-relaxed">
                            I get an error saying "To receive L2 KAS, your wallet must have a balance of less than 2 KAS on Kasplex L2."{' '}
                        </p>
                        <p className="text-xs sm:text-sm text-outline leading-relaxed">
                            This faucet is built to supply test tokens to developers for testing smart contracts and engaging with Kasplex L2.A balance exceeding 2 KAS is enough for testing purposes.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Faucet;
