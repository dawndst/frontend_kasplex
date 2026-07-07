import IconKaskeeper from '@/assets/icon-kaskeeper.png'
import IconChainlink from '@/assets/icon-chainlink.png'
import IconKaskad from '@/assets/icon-kaskad.png'
import IconDagScan from '@/assets/icon-dagscan.png'
import IconKaspCom from '@/assets/icon-kaspacom.png'
import IconZealous from '@/assets/icon-zealous.png'
// import IconCrest from '@/assets/icon-crestdev.png'
import IconKastle from '@/assets/icon-kastle.png'
import IconKasperia from '@/assets/icon-kasperia.png'
import IconKurve from '@/assets/icon-Kurve.svg'
import IconCircle from '@/assets/icon-Circle.png'
import IconAnkr from '@/assets/icon-ankr.jpg'
import IconKaspaFinance from '@/assets/icon-kaspa-finance.png'
import IconCryptoapis from '@/assets/icon-cryptoAPI.jpg'
import IconEllipal from '@/assets/icon-ellipal.png'
import IconRD from '@/assets/icon-rdauditors.jpg'
import IconBitslab from '@/assets/icon-bitslab.jpg'
import IconKNS from '@/assets/icon-kns.jpg'
import IconKasware from '@/assets/icon-kasware.png'
import IconYumo from '@/assets/icon-yumo.jpg'
import IconBsa from '@/assets/icon-bsa.png'
import IconKroko from '@/assets/icon-kroko.svg'
import IconKasFun from '@/assets/icon-kasfun.svg'
import IconAlph from '@/assets/icon-alph.png'
import IconBitget from '@/assets/icon-bitget.png'

import IconUex from '@/assets/icon-uex.jpg';
import IconBridgers from '@/assets/icon-bridgers.jpg';
import IconGate from '@/assets/icon-gate.jpg';

export const FaucetApi = '/faucet-api'

export const Krc20Url = 'https://docs-kasplex.gitbook.io/krc20/'
export const EVMDocsUrl = 'https://docs-kasplex.gitbook.io/l2-network'

export const TAGS = [
    { key: "All", name: "All" },
    { key: "DEX,LaunchPad", name: "DeFi" },
    { key: "Wallet,Bridge", name: "INFRA" },
    { key: "Name Service dAPP", name: "DAPP" },
    { key: "Stablecoin,Oracle,Node & API,Security,Prediction Market", name: "BUSINESS" },
]

export const chaildTag = [{
    title: "Active partnerships",
    tipMsg: ` The projects listed are already building on the first EVM L2 on Kaspa, they range from DeFi to infrastracture tools. They’re shaping the future of Kaspa’s programmable layer. Join our ecosystem to build, collaborate, and shape the next wave of applications together`
}]

export const ecoSystem = [
    
    {
        name: "Kurve",
        types: ["Bridge"],
        href: "https://kasbridge-evm.kaspafoundation.org/",
        tag: "Active partnerships",
        logo: IconKurve,
        isOpen: false,
        isStar: true,
        desc: "KURVE allows you to transfer $KAS between Layer 1 and Kasplex EVM. KURVE brings a seamless and secure two-way transaction channel between Kaspa Layer 1 and Kasplex Layer 2 by introducing the cross-chain bridge.",
    },
    {
        name: "Bitslab",
        types: ["Security"],
        href: "https://www.bitslab.xyz/",
        tag: "",
        logo: IconBitslab,
        isOpen: false,
        isStar: true,
        desc: "BitsLab is a Web3 security organization focused on AI-powered infrastructure to audit, monitor, and defend digital assets. It provides enterprise-grade smart contract audits, automated vulnerability detection, and anti-scam protection, leveraging a vast proprietary dataset to secure ecosystems for over 716 million users and $160 billion in on-chain value.",
    },
    {
        name: "Kaskeeper",
        types: ["Wallet"],
        href: "https://kaskeeper.vercel.app/",
        tag: "",
        logo: IconKaskeeper,
        isOpen: false,
        isStar: true,
        desc: "KasKeeper is a web3 wallet which special designed for Kaspa ecosystem. We keep in touch with the KEF and always ready to support the new features in Kaspa. Currently, we have support all the basic function you need in Kaspa, including the operation of native KAS and KRC20 related tools.",
    },
    {
        name: "Kasperia",
        types: ["Wallet"],
        tag: "",
        href: "https://x.com/KasperiaWallet",
        logo: IconKasperia,
        isOpen: false,
        isStar: true,
        desc: "Kasperia — The Ultra-Light Kaspa Wallet for Speed, Simplicity & L2 Integration.",
    },
    {
        name: "Circle",
        types: ["Stablecoin"],
        href: "https://circle.com/",
        tag: "Active partnerships",
        logo: IconCircle,
        isOpen: false,
        isStar: true,
        desc: "Circle is a global financial-technology firm best known as issuer of stablecoins (e.g. USDC, EURC) and provider of APIs, wallets and payment/treasury infrastructure — bridging traditional finance and blockchain, enabling businesses and institutions to move money globally, and powering programmable money rails.",
    },

    {
        name: "Chainlink",
        types: ["Oracle"],
        href: "https://chain.link/",
        tag: "Active partnerships",
        logo: IconChainlink,
        isOpen: false,
        isStar: true,
        desc: "Chainlink is the industry-standard oracle platform bringing the capital markets onchain and powering the majority of decentralized finance.",
    },
    {
        name: "Kroko",
        types: ["DEX"],
        href: "https://krokoswap.io/",
        tag: "Active partnerships",
        logo: IconKroko,
        isOpen: false,
        isStar: true,
        desc: "KrokoSwap is a high-performance decentralized exchange natively built on the KASPLEX Layer 2. KrokoSwap Unleashing the power of V2 + V3 concentrated liquidity for a faster, deeper, and more efficient DeFi experience. Swap smart, earn more.",
    },
    {
        name: "Kas.fun",
        types: ["LaunchPad"],
        href: "https://kas.fun/",
        tag: "",
        logo: IconKasFun,
        isOpen: false,
        isStar: true,
        desc: "Kasfun is the first decentralized launchpad built on the KASPLEX Layer 2 protocol, empowering users to create tokens with absolute transparency. Fair launches. Zero gatekeepers. Pure community-driven liquidity. ",
    },
    {
        name: "YUMO",
        types: ["dAPP"],
        href: "https://yumoai.net/slide",
        tag: "Active partnerships",
        logo: IconYumo,
        isOpen: false,
        isStar: false,
        desc: "YUMO transforms lightweight interactions into structured behavioral data, enabling AI to build dynamic digital personas (Momos) and powering next-generation world models, user insights, and autonomous growth systems across Web3.",
    },
    {
        name: "Block Security Arena",
        types: ["Bridge"],
        href: "https://www.blocksecx.com/",
        tag: "Active partnerships",
        logo: IconBsa,
        isOpen: false,
        isStar: false,
        desc: "BSA (Block Security Arena) is an AI-driven Web3 Security Infrastructure platform designed to democratize blockchain security education and provide accessible tools for developers, auditors, and security researchers.",
    },
    {
        name: "Alph",
        types: ["dAPP"],
        href: "http://alph.ai/",
        tag: "",
        logo: IconAlph,
        isOpen: false,
        isStar: true,
        desc: `Alph Al is an Al-driven decentralized trading execution terminal designed specifically for high-frequency memecoin traders. <br /> By integrating Multi-Party Computation (MPC) with Artificial Intelligence (Al), Alph Al creates a next-generation trading tool that combines the smooth experience of a centralized exchange
(CEX) with the trustless nature of decentralized finance (DEX).`,
    },
    {
        name: "KNS",
        types: ["Name Service"],
        href: "https://app.knsdomains.org/",
        tag: "",
        logo: IconKNS,
        isOpen: false,
        isStar: false,
        desc: "Digital Identity On Kaspa.",
    },
    {
        name: "Bitget Wallet",
        types: ["Wallet"],
        href: "https://web3.bitget.com/",
        tag: "",
        logo: IconBitget,
        isOpen: false,
        isStar: true,
        desc: "Bitget Wallet is a non-custodial crypto wallet designed to make crypto simple and secure for everyone. With over 80 million users, it brings together a full suite of crypto services, including swaps, market insights, staking, rewards, DApp exploration, and payment solutions.",
    },
    {
        name: "Kaspa.com",
        types: ["DEX"],
        href: "https://kaspa.com/",
        tag: "",
        logo: IconKaspCom,
        isOpen: false,
        isStar: false,
        desc: "The #1 Leading Kaspa DeFi Platform — DEX, Lending & Borrowing, Launchpad, and NFTs.",
    },
    {
        name: "Ankr",
        types: ["Node & API"],
        href: "https://ankr.com/",
        tag: "Active partnerships",
        logo: IconAnkr,
        isOpen: false,
        isStar: false,
        desc: "Ankr provides decentralized Web3 infrastructure: global RPC / node services across many blockchains, staking solutions, tools for developers and enterprises — helping Dapps, wallets and services interact with blockchains without managing their own nodes or infra.",
    },
    {
        name: "CryptoAPI",
        types: ["Node & API"],
        href: "https://cryptoapis.io/",
        tag: "",
        logo: IconCryptoapis,
        isOpen: false,
        isStar: false,
        desc: "Crypto APIs is a comprehensive blockchain infrastructure suite that provides developers and businesses with unified APIs, real-time data, and secure transaction tools. It enables seamless integration across multiple blockchain networks, simplifying the development of wallets, exchanges, payment systems, and other decentralized applications.",
    },
    {
        name: "RD Auditors",
        types: ["Security"],
        href: "https://rdauditors.com/",
        tag: "",
        logo: IconRD,
        isOpen: false,
        isStar: false,
        desc: "Comprehensive Cybersecurity, Monitoring, Web3, and AI solutions built for developers and designed for everyone.",
    },
    {
        name: "Kaskad",
        types: ["DeFi"],
        href: "https://kaskad.app/",
        tag: "",
        logo: IconKaskad,
        isOpen: false,
        isStar: false,
        desc: "Fully decentralized lending protocol, tailored for Kaspa’s high-speed architecture.",
    },
    {
        name: "DagScan",
        types: ["Blockchain Explorer"],
        href: "https://www.dagscan.xyz/",
        tag: "",
        logo: IconDagScan,
        isOpen: false,
        isStar: false,
        desc: "Explore the Kaspa EVM ecosystem with DagScan - Your gateway to BlockDAG transactions, blocks, and addresses.",
    },
    {
        name: "Zealous",
        types: ["DEX"],
        href: "https://www.zealousswap.com/",
        tag: "",
        logo: IconZealous,
        isOpen: false,
        isStar: false,
        desc: "Zealous Swap - Kaspa’s first AMM DEX with NFT-based fees, protocol-owned liquidity, insurance fund, and modular fees.",
    },
    {
        name: "Ellipal",
        types: ["Wallet"],
        href: "https://www.ellipal.com/",
        tag: "",
        logo: IconEllipal,
        isOpen: false,
        isStar: false,
        desc: "ELLIPAL, Leader of Air-gapped cold wallet. Attention: No Customer-facing Facebook Groups!",
    },
    // {
    //     name: "Crest Development",
    //     types: ["Development Studio"],
    //     href: "https://crestdev.pro/",
    //     tag: "",
    //     logo: IconCrest,
    //     isOpen: false,
    //     desc: "Crest Dev Studio is a team of experienced smart contract developers and blockchain specialists creating reliable and efficient products for business and finance. Our solutions blend cutting-edge technology with intuitive design, making complex concepts simple and accessible.",
    // },
    {
        name: "Kastle",
        types: ["Wallet"],
        href: "https://kastle.cc/",
        tag: "",
        logo: IconKastle,
        isOpen: false,
        isStar: false,
        desc: "Kaspa wallet - send, receive and manage your Kaspa assets with ease and security and be the king of your own Kastle.",
    },
    {
        name: "Kaspa Finance",
        types: ["DEX"],
        href: "https://kaspafinance.io/",
        tag: "",
        logo: IconKaspaFinance,
        isOpen: false,
        isStar: false,
        desc: "KaspaFinance.io is the first full-suite DeFi super protocol built on the Kaspa L2. From V3-style concentrated liquidity AMMs, Farming and LPs, borrowing and lending, token creation, to AI-powered trading bots and NLP trading, KFC (Kaspa Finance) brings Ethereum-grade DeFi infrastructure to the fastest proof-of-work blockchain in existence.",
    },
    {
        name: "Kasware",
        types: ["Wallet"],
        tag: "",
        href: "https://www.kasware.xyz/",
        logo: IconKasware,
        isOpen: false,
        isStar: false,
        desc: "Kasware is the most feature-rich and security-oriented wallet for Kaspa – with support for KRC20, KNS, KRC721 and L2 network.",
    },
    {
        name: "UEX Exchange",
        types: ["BUSINESS"],
        tag: "",
        href: "https://uex.us/",
        logo: IconUex,
        isOpen: false,
        isStar: false,
        desc: "A reliable platform for crypto and fiat transactions — manage your assets, make payments, and access loans in one place.",
    },
    {
        name: "Bridgers",
        types: ["INFRA"],
        tag: "",
        href: "https://app.bridgers.xyz/#/",
        logo: IconBridgers,
        isOpen: false,
        isStar: true,
        desc: "BRIDGERS is a non-custodial cross-chain aggregation protocol . Supports over 500 cryptocurrencies, enabling quick, transparent transactions without KYC, cost-effective access, and full technical support for an outstanding exchange experience.",
    },
    {
        name: "Gate",
        types: ["BUSINESS"],
        tag: "",
        href: "https://www.gate.com/",
        logo: IconGate,
        isOpen: false,
        isStar: true,
        desc: "Founded in 2013, Gate is one of the top 3 cryptocurrency exchanges globally by real trading volume, providing secure, reliable, transparent, and authentic digital asset trading services to over 52 million users.",
    },

]