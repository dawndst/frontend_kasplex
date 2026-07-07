import React from 'react';

const Section: React.FC<{ id: string; num: string; title: string; children: React.ReactNode }> = ({ id, num, title, children }) => (
    <section id={id} className="flex flex-col gap-4 scroll-mt-24">
        <h2 className="font-headline font-bold text-xl sm:text-2xl text-[#e2e2e2] tracking-tight flex items-baseline gap-3">
            <span className="font-mono text-primary text-base sm:text-lg shrink-0">{num}.</span>
            <span>{title}</span>
        </h2>
        <div className="flex flex-col gap-4 pl-0 sm:pl-8">{children}</div>
    </section>
);

const SubHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="font-headline font-semibold text-base sm:text-lg text-secondary pt-2">{children}</h3>
);

const List: React.FC<{ children: React.ReactNode; nested?: boolean }> = ({ children, nested = false }) => (
    <ul className={`${nested ? 'list-[circle]! mt-2! marker:text-outline' : 'list-disc! marker:text-primary'} pl-5! space-y-2`}>
        {children}
    </ul>
);

const PrivacyPolicy: React.FC = () => {
    return (
        <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* ------------------ Hero ------------------ */}
            <header className="flex flex-col gap-5 items-start pb-10 border-b border-outline-variant">
                <h1 className="font-headline font-black text-3xl sm:text-4xl md:text-5xl text-[#e2e2e2] leading-[1.15] tracking-tight">
                    Privacy Policy for <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Kasplex.org</span>
                </h1>
                <p className="inline-flex items-center gap-2 font-mono text-[11px] text-primary-fixed bg-secondary-container/30 border border-primary/20 px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Last Updated: September 8, 2025
                </p>
                <p className="text-sm sm:text-[15px] leading-7 text-outline">
                    Kasplex.org (“Kasplex,” “we,” “us,” or “our”) is a non-profit initiative funded by the
                    Kaspa Ecosystem Foundation (KEF), dedicated to enhancing the Kaspa blockchain ecosystem
                    through tools, protocols, and services, including the KRC-20 protocol, Layer 2
                    solutions, and APIs for developers and users. We are committed to transparency and
                    respecting user privacy. This Privacy Policy outlines how we handle information when you
                    interact with our website, services, and tools (collectively, the “Services”). We do not
                    actively collect personal information from users. However, certain information may be
                    provided voluntarily by you or recorded on the Kaspa blockchain, which is inherently
                    public and immutable. This policy explains our practices regarding such information. By
                    accessing or using Kasplex.org or our Services, you acknowledge that you have read,
                    understood, and agree to this Privacy Policy. If you do not agree, please refrain from
                    using our Services.
                </p>
            </header>

            {/* ------------------ Document body ------------------ */}
            <article
                className="pt-10 flex flex-col gap-12 text-sm sm:text-[15px] leading-7 text-outline
                    [&_strong]:text-[#e2e2e2] [&_strong]:font-semibold
                    [&_a]:text-primary! [&_a:hover]:text-primary-fixed! [&_a]:underline! [&_a]:underline-offset-4 [&_a]:decoration-primary/40 [&_a]:transition-colors"
            >
                <Section id="scope" num="1" title="Scope of This Privacy Policy">
                    <p>
                        This Privacy Policy applies to all users of Kasplex.org, including website visitors,
                        developers using our APIs, and participants in the Kasplex ecosystem (e.g., those
                        interacting with KRC-20 tokens). Due to the decentralized nature of the Kaspa
                        blockchain, some data (e.g., blockchain transactions) is publicly accessible and not
                        controlled by Kasplex. This policy primarily addresses non-blockchain data we may
                        receive and our handling of such data.
                    </p>
                </Section>

                <Section id="no-collection" num="2" title="Information We Do Not Actively Collect">
                    <p>We do not proactively collect personal information from users. However, we may receive or process information in the following circumstances:</p>

                    <SubHeading>2.1 Information You Voluntarily Provide</SubHeading>
                    <List>
                        <li><strong>Contact Information:</strong> If you choose to contact us via email, support forms, or community channels (e.g., Discord, Telegram), you may voluntarily provide information such as your name, email address, or other contact details.</li>
                        <li><strong>Developer Information:</strong> If you register to use our APIs or developer tools, you may voluntarily provide details such as your name, email address, GitHub username, or other account information.</li>
                        <li><strong>Feedback and Communications:</strong> Any information you voluntarily share through surveys, feedback forms, or direct communications with our team.</li>
                    </List>

                    <SubHeading>2.2 Information Collected Automatically</SubHeading>
                    <p><strong>Usage Data:</strong> When you visit Kasplex.org or use our Services, we may passively collect limited information to ensure functionality and improve user experience, such as:</p>
                    <List>
                        <li>IP address (anonymized where possible)</li>
                        <li>Browser type and version</li>
                        <li>Operating system</li>
                        <li>Pages visited and time spent on our website</li>
                        <li>Referral URLs</li>
                        <li>Device identifiers</li>
                    </List>
                    <p><strong>Cookies and Tracking Technologies:</strong> We may use essential cookies or similar technologies to ensure the proper functioning of our website. We do not use cookies for tracking or profiling purposes. Examples include:</p>
                    <List>
                        <li><strong>Essential Cookies:</strong> Necessary for website functionality, such as maintaining session state. You can manage cookies through your browser settings. Disabling cookies may affect certain features.</li>
                    </List>

                    <SubHeading>2.3 Blockchain Data</SubHeading>
                    <List>
                        <li>
                            <strong>Public Blockchain Data:</strong> When you interact with the Kaspa blockchain through Kasplex tools (e.g., creating KRC-20 tokens or using Layer 2 solutions), data such as wallet addresses, transaction details, and token metadata is recorded on the Kaspa blockchain. This data is:
                            <List nested>
                                <li>Publicly accessible to anyone on the blockchain.</li>
                                <li>Immutable and not controlled by Kasplex.</li>
                                <li>Not linked to your personal information unless you explicitly provide such a link.</li>
                            </List>
                        </li>
                    </List>

                    <SubHeading>2.4 Third-Party Data</SubHeading>
                    <p><strong>Third-Party Services:</strong> If you access our Services through third-party platforms (e.g., GitHub for developer tools, wallets for blockchain interactions), we may receive limited information, such as your public username, subject to the third party’s privacy policies. We do not actively request this information.</p>
                </Section>

                <Section id="use" num="3" title="How We Use Information">
                    <p>Any information we receive is used solely for the following purposes:</p>
                    <List>
                        <li className="[&>p]:mt-1!">
                            <strong>To Provide and Maintain Services:</strong>
                            <p>To respond to your inquiries or support requests.</p>
                            <p>To enable access to our website, APIs, and developer tools.</p>
                            <p>To facilitate interactions with the Kaspa blockchain, such as KRC-20 token creation.</p>
                        </li>
                        <li className="[&>p]:mt-1!">
                            <strong>Website Functionality:</strong>
                            <p>To ensure the proper operation of our website and Services.</p>
                            <p>To analyze anonymized usage data for improving performance and user experience.</p>
                        </li>
                        <li className="[&>p]:mt-1!">
                            <strong>Communication:</strong>
                            <p>To send technical notices, updates, or responses related to Kasplex or the Kaspa ecosystem, only if you have initiated contact.</p>
                        </li>
                        <li className="[&>p]:mt-1!">
                            <strong>Security:</strong>
                            <p>To detect and prevent fraud, abuse, or security threats to our Services.</p>
                            <p>To protect the integrity of the Kasplex platform and the Kaspa blockchain.</p>
                        </li>
                        <li className="[&>p]:mt-1!">
                            <strong>Legal Compliance:</strong>
                            <p>To comply with applicable laws, regulations, or legal requests.</p>
                        </li>
                    </List>
                    <p>We do not use information for marketing, profiling, or automated decision-making that produces legal or significant effects.</p>
                </Section>

                <Section id="share" num="4" title="How We Share Information">
                    <p>We do not sell, trade, or rent any information to third parties. Information may be shared only in the following cases:</p>
                    <List>
                        <li><strong>Service Providers:</strong> We may share limited, anonymized data with trusted third-party providers (e.g., hosting services, analytics tools) to support website functionality. These providers are contractually obligated to protect the data and use it only for specified purposes.</li>
                        <li><strong>Kaspa Ecosystem Foundation (KEF):</strong> As a KEF-funded initiative, we may share aggregated, anonymized data to support the Kaspa ecosystem’s development.</li>
                        <li><strong>Legal Obligations:</strong> We may disclose information if required by law, such as in response to a court order or subpoena.</li>
                        <li><strong>Public Blockchain Data:</strong> Blockchain data (e.g., wallet addresses, transaction details) is publicly accessible on the Kaspa network and not controlled by Kasplex.</li>
                    </List>
                </Section>

                <Section id="storage-security" num="5" title="Data Storage and Security">
                    <p><strong>Storage:</strong> Non-blockchain information (e.g., contact details from inquiries) is stored securely on servers managed by us or trusted providers. Blockchain data is stored on the decentralized Kaspa network and is not managed by Kasplex.</p>
                    <p><strong>Security Measures:</strong> We implement reasonable technical and organizational measures, such as encryption and access controls, to protect any non-blockchain data we receive. However, no system is fully secure, and we cannot guarantee absolute security.</p>
                    <p><strong>Retention:</strong> We retain non-blockchain information only as long as necessary for the purposes outlined (e.g., resolving your inquiry) or as required by law. Blockchain data is permanent and immutable due to the nature of the Kaspa blockchain.</p>
                </Section>

                <Section id="rights" num="6" title="Your Rights and Choices">
                    <p>Depending on your jurisdiction, you may have rights regarding any personal information we receive, including:</p>
                    <List>
                        <li><strong>Access:</strong> Request access to any personal information we hold.</li>
                        <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information.</li>
                        <li><strong>Deletion:</strong> Request deletion of non-blockchain information, subject to legal or technical limitations. (Blockchain data cannot be deleted due to its immutability.)</li>
                        <li><strong>Objection or Restriction:</strong> Object to or restrict certain processing of your data.</li>
                        <li><strong>Data Portability:</strong> Request a copy of your data in a structured format.</li>
                    </List>
                    <p>To exercise these rights, contact us at <a href="mailto:privacy@kasplex.org">privacy@kasplex.org</a>. We will respond within a reasonable timeframe, typically 30 days, subject to applicable laws.</p>
                    <p>You can also manage cookies through your browser settings to disable non-essential cookies, though this may affect website functionality.</p>
                </Section>

                <Section id="cookies" num="7" title="Cookies and Tracking Technologies">
                    <p>We use only essential cookies to ensure website functionality. We do not use cookies for tracking, analytics, or advertising. For more details, you can manage cookies via your browser.</p>
                </Section>

                <Section id="third-party" num="8" title="Third-Party Links and Services">
                    <p>Our Services may link to third-party platforms (e.g., Kaspa blockchain explorers, GitHub, wallet providers). We are not responsible for their privacy practices. Please review their policies before interacting.</p>
                </Section>

                <Section id="intl" num="9" title="International Data Transfers">
                    <p>As a global platform, any non-blockchain information we receive may be processed in countries other than your own. We ensure compliance with applicable data protection laws, using safeguards like standard contractual clauses where required.</p>
                </Section>

                <Section id="children" num="10" title="Children’s Privacy">
                    <p>Our Services are not intended for individuals under 16. We do not knowingly collect or process information from children. If we receive such information, we will delete it promptly.</p>
                </Section>

                <Section id="changes" num="11" title="Changes to This Privacy Policy">
                    <p>We may update this policy to reflect changes in our practices or legal requirements. Significant changes will be communicated via our website or community channels (e.g., Discord, Telegram) with an updated “Last Updated” date.</p>
                </Section>

                <Section id="contact" num="12" title="Contact Us">
                    <p>For questions or requests regarding this Privacy Policy, contact us at:</p>
                    <List>
                        <li><strong>Email:</strong> <a href="mailto:privacy@kasplex.org">privacy@kasplex.org</a></li>
                        <li><strong>Website:</strong> <a href="https://kasplex.org" target="_blank" rel="noreferrer">https://kasplex.org</a></li>
                        <li><strong>Community Channels:</strong> Join our Discord or Telegram for support (links on our website).</li>
                    </List>
                    <p>We aim to respond promptly to all inquiries.</p>
                </Section>

                <Section id="jurisdictions" num="13" title="Additional Information for Specific Jurisdictions">
                    <SubHeading>13.1 European Economic Area (EEA) and United Kingdom</SubHeading>
                    <p>
                        Under the GDPR or equivalent laws, you have additional rights (e.g., access, deletion).
                        Our legal basis for processing any voluntarily provided information includes:
                    </p>
                    <List>
                        <li><strong>Consent:</strong> For processing information you provide voluntarily.</li>
                        <li><strong>Contract:</strong> To fulfill requests you initiate (e.g., API access).</li>
                        <li><strong>Legitimate Interests:</strong> For security and service improvements, balanced against your rights.
                            You may lodge a complaint with your local data protection authority if needed.</li>
                    </List>

                    <SubHeading>13.2 California Residents</SubHeading>
                    <p>
                        Under the CCPA, California residents have rights to know, delete, or opt out of data sales.
                        We do not sell data and only process information you voluntarily provide.
                    </p>
                </Section>
            </article>
        </main>
    );
};

export default PrivacyPolicy;
