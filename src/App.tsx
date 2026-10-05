import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppLayout } from "./components/layout/AppLayout";
import { ResumeGenerator } from "./pages/ResumeGenerator";
import { QRCodeGenerator } from "./pages/QRCodeGenerator";
import { InvoiceGenerator } from "./pages/InvoiceGenerator";
import { FactureGenerator } from "./pages/FactureGenerator";
import { DocumentGenerator } from "./pages/DocumentGenerator";
import { AuthCallback } from "./pages/AuthCallback";
import { ImageTools } from "./pages/ImageTools";
import { CompressImage } from "./pages/image-tools/CompressImage";
import { ImageToText } from "./pages/image-tools/ImageToText";
import { ImageToPrompt } from "./pages/image-tools/ImageToPrompt";
import { ResizeImage } from "./pages/image-tools/ResizeImage";
import { RemoveBackground } from "./pages/image-tools/RemoveBackground";
import { HtmlToImage } from "./pages/image-tools/HtmlToImage";
import { CropImage } from "./pages/image-tools/CropImage";
import { RotateImage } from "./pages/image-tools/RotateImage";
import { FormatConverter } from "./pages/image-tools/FormatConverter";
import { WatermarkImage } from "./pages/image-tools/WatermarkImage";
import { MemeGenerator } from "./pages/image-tools/MemeGenerator";
import { UpscaleImage } from "./pages/image-tools/UpscaleImage";
import { PdfTools } from "./pages/PdfTools";
import { MergePdf } from "./pages/pdf-tools/MergePdf";
import { SplitPdf } from "./pages/pdf-tools/SplitPdf";
import { RotatePdf } from "./pages/pdf-tools/RotatePdf";
import { JpgToPdf } from "./pages/pdf-tools/JpgToPdf";
import { WatermarkPdf } from "./pages/pdf-tools/WatermarkPdf";
import { PageNumbersPdf } from "./pages/pdf-tools/PageNumbersPdf";
import { OrganizePdf } from "./pages/pdf-tools/OrganizePdf";
import { PdfToJpg } from "./pages/pdf-tools/PdfToJpg";
import { SignPdf } from "./pages/pdf-tools/SignPdf";
import { OcrPdf } from "./pages/pdf-tools/OcrPdf";
import { ComparePdf } from "./pages/pdf-tools/ComparePdf";
import { RedactPdf } from "./pages/pdf-tools/RedactPdf";
import { CropPdf } from "./pages/pdf-tools/CropPdf";
import { CompressPdf } from "./pages/pdf-tools/CompressPdf";
import { EditPdf } from "./pages/pdf-tools/EditPdf";
import { ScanPdf } from "./pages/pdf-tools/ScanPdf";
import { HtmlToPdf } from "./pages/pdf-tools/HtmlToPdf";
import { UnlockPdf } from "./pages/pdf-tools/UnlockPdf";
import { BackendRequiredTool } from "./pages/pdf-tools/BackendRequiredTool";
import { SocialTools } from "./pages/SocialTools";
import { InstagramFilters } from "./pages/social-tools/InstagramFilters";
import { InstagramPostGenerator } from "./pages/social-tools/InstagramPostGenerator";
import { InstagramStoryGenerator } from "./pages/social-tools/InstagramStoryGenerator";
import { InstagramDownloader } from "./pages/social-tools/InstagramDownloader";
import { TweetGenerator } from "./pages/social-tools/TweetGenerator";
import { TweetToImage } from "./pages/social-tools/TweetToImage";
import { TwitterAdRevenue } from "./pages/social-tools/TwitterAdRevenue";
import { YouTubeThumbnail } from "./pages/social-tools/YouTubeThumbnail";
import { VimeoThumbnail } from "./pages/social-tools/VimeoThumbnail";
import { OpenGraphGenerator } from "./pages/social-tools/OpenGraphGenerator";
import { EncryptionTools } from "./pages/EncryptionTools";
import { Base64Tool } from "./pages/encryption-tools/Base64Tool";
import { HashTool } from "./pages/encryption-tools/HashTool";
import { HashDecryptTool } from "./pages/encryption-tools/HashDecryptTool";
import { SymmetricCryptoTool } from "./pages/encryption-tools/SymmetricCryptoTool";
import { EncodeDecodeTool } from "./pages/encryption-tools/EncodeDecodeTool";
import { ColorTools } from "./pages/ColorTools";
import { AIPaletteGenerator } from "./pages/color-tools/AIPaletteGenerator";
import { HexToRgba } from "./pages/color-tools/HexToRgba";
import { RgbaToHex } from "./pages/color-tools/RgbaToHex";
import { ColorShades } from "./pages/color-tools/ColorShades";
import { ColorMixer } from "./pages/color-tools/ColorMixer";
import { PaperMe } from "./pages/PaperMe";
import { QrTools } from "./pages/QrTools";
import { PasswordGenerator } from "./pages/qr-tools/PasswordGenerator";
import { BarcodeGenerator } from "./pages/qr-tools/BarcodeGenerator";
import { FakeIbanGenerator } from "./pages/qr-tools/FakeIbanGenerator";
import { GmailGenerator } from "./pages/qr-tools/GmailGenerator";
import { CodingTools } from "./pages/CodingTools";
import { CodeToImage } from "./pages/coding-tools/CodeToImage";
import { SlugGenerator } from "./pages/coding-tools/SlugGenerator";
import { RNShadowGenerator } from "./pages/coding-tools/RNShadowGenerator";
import { HtmlMinifier } from "./pages/coding-tools/HtmlMinifier";
import { CssMinifier } from "./pages/coding-tools/CssMinifier";
import { JsMinifier } from "./pages/coding-tools/JsMinifier";
import { HtmlFormatter } from "./pages/coding-tools/HtmlFormatter";
import { CssFormatter } from "./pages/coding-tools/CssFormatter";
import { JsFormatter } from "./pages/coding-tools/JsFormatter";
import { JsonViewer } from "./pages/coding-tools/JsonViewer";
import { CssLoaderGenerator } from "./pages/coding-tools/CssLoaderGenerator";
import { CssCheckboxGenerator } from "./pages/coding-tools/CssCheckboxGenerator";
import { CssSwitchGenerator } from "./pages/coding-tools/CssSwitchGenerator";
import { CssClipPathGenerator } from "./pages/coding-tools/CssClipPathGenerator";
import { CssBackgroundPatternGenerator } from "./pages/coding-tools/CssBackgroundPatternGenerator";
import { CssCubicBezierGenerator } from "./pages/coding-tools/CssCubicBezierGenerator";
import { CssGlassmorphismGenerator } from "./pages/coding-tools/CssGlassmorphismGenerator";
import { CssTextGlitchGenerator } from "./pages/coding-tools/CssTextGlitchGenerator";
import { CssGradientGenerator } from "./pages/coding-tools/CssGradientGenerator";
import { CssTriangleGenerator } from "./pages/coding-tools/CssTriangleGenerator";
import { CssBoxShadowGenerator } from "./pages/coding-tools/CssBoxShadowGenerator";
import { CssBorderRadiusGenerator } from "./pages/coding-tools/CssBorderRadiusGenerator";
import { CssTextShadowGenerator } from "./pages/coding-tools/CssTextShadowGenerator";
import { ConvertWebsiteToApp } from "./pages/ConvertWebsiteToApp";
import { AppBuilder } from "./pages/AppBuilder";
import { PwaInstallPage } from "./pages/PwaInstallPage";
import { FileText, Presentation, Table, Globe, Lock, Archive, Wrench, Languages, Shield, Palette, Smartphone } from "lucide-react";

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/auth/v1/callback" element={<AuthCallback />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/resume" replace />} />
            <Route path="/resume" element={<ResumeGenerator />} />
            <Route path="/qr" element={<QrTools />} />
            <Route path="/qr/generator" element={<QRCodeGenerator />} />
            <Route path="/qr/password" element={<PasswordGenerator />} />
            <Route path="/qr/barcode" element={<BarcodeGenerator />} />
            <Route path="/qr/iban" element={<FakeIbanGenerator />} />
            <Route path="/qr/gmail-generator" element={<GmailGenerator />} />
            <Route path="/invoice" element={<InvoiceGenerator />} />
            <Route path="/facture" element={<FactureGenerator />} />
            <Route path="/document" element={<DocumentGenerator />} />
            <Route path="/image-tools" element={<ImageTools />} />
            <Route path="/image-tools/compress" element={<CompressImage />} />
            <Route path="/image-tools/text" element={<ImageToText />} />
            <Route path="/image-tools/prompt" element={<ImageToPrompt />} />
            <Route path="/image-tools/resize" element={<ResizeImage />} />
            <Route path="/image-tools/remove-bg" element={<RemoveBackground />} />
            <Route path="/image-tools/html-to-image" element={<HtmlToImage />} />
            <Route path="/image-tools/crop" element={<CropImage />} />
            <Route path="/image-tools/rotate" element={<RotateImage />} />
            <Route path="/image-tools/convert-format" element={<FormatConverter />} />
            <Route path="/image-tools/watermark" element={<WatermarkImage />} />
            <Route path="/image-tools/meme" element={<MemeGenerator />} />
            <Route path="/image-tools/upscale" element={<UpscaleImage />} />
            
            {/* PDF Tools */}
            <Route path="/pdf-tools" element={<PdfTools />} />
            <Route path="/pdf-tools/merge" element={<MergePdf />} />
            <Route path="/pdf-tools/split" element={<SplitPdf />} />
            <Route path="/pdf-tools/compress" element={<CompressPdf />} />
            <Route path="/pdf-tools/to-word" element={<BackendRequiredTool title="PDF to Word" description="Convert PDF to editable Word document." icon={FileText} accept={{ 'application/pdf': ['.pdf'] }} actionName="Convert to Word" outputExtension=".docx" />} />
            <Route path="/pdf-tools/to-powerpoint" element={<BackendRequiredTool title="PDF to PowerPoint" description="Convert PDF to editable PowerPoint presentation." icon={Presentation} accept={{ 'application/pdf': ['.pdf'] }} actionName="Convert to PowerPoint" outputExtension=".pptx" />} />
            <Route path="/pdf-tools/to-excel" element={<BackendRequiredTool title="PDF to Excel" description="Convert PDF to editable Excel spreadsheet." icon={Table} accept={{ 'application/pdf': ['.pdf'] }} actionName="Convert to Excel" outputExtension=".xlsx" />} />
            <Route path="/pdf-tools/word-to-pdf" element={<BackendRequiredTool title="Word to PDF" description="Convert Word document to PDF." icon={FileText} accept={{ 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'application/msword': ['.doc'] }} actionName="Convert to PDF" outputExtension=".pdf" />} />
            <Route path="/pdf-tools/powerpoint-to-pdf" element={<BackendRequiredTool title="PowerPoint to PDF" description="Convert PowerPoint presentation to PDF." icon={Presentation} accept={{ 'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'], 'application/vnd.ms-powerpoint': ['.ppt'] }} actionName="Convert to PDF" outputExtension=".pdf" />} />
            <Route path="/pdf-tools/excel-to-pdf" element={<BackendRequiredTool title="Excel to PDF" description="Convert Excel spreadsheet to PDF." icon={Table} accept={{ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'] }} actionName="Convert to PDF" outputExtension=".pdf" />} />
            <Route path="/pdf-tools/edit" element={<EditPdf />} />
            <Route path="/pdf-tools/to-jpg" element={<PdfToJpg />} />
            <Route path="/pdf-tools/jpg-to-pdf" element={<JpgToPdf />} />
            <Route path="/pdf-tools/sign" element={<SignPdf />} />
            <Route path="/pdf-tools/watermark" element={<WatermarkPdf />} />
            <Route path="/pdf-tools/rotate" element={<RotatePdf />} />
            <Route path="/pdf-tools/html-to-pdf" element={<HtmlToPdf />} />
            <Route path="/pdf-tools/unlock" element={<UnlockPdf />} />
            <Route path="/pdf-tools/protect" element={<BackendRequiredTool title="Protect PDF" description="Add password protection to your PDF." icon={Lock} accept={{ 'application/pdf': ['.pdf'] }} actionName="Protect PDF" outputExtension="_protected.pdf" />} />
            <Route path="/pdf-tools/organize" element={<OrganizePdf />} />
            <Route path="/pdf-tools/to-pdfa" element={<BackendRequiredTool title="PDF to PDF/A" description="Convert PDF to PDF/A format for long-term archiving." icon={Archive} accept={{ 'application/pdf': ['.pdf'] }} actionName="Convert to PDF/A" outputExtension="_pdfa.pdf" />} />
            <Route path="/pdf-tools/repair" element={<BackendRequiredTool title="Repair PDF" description="Repair a damaged or corrupted PDF file." icon={Wrench} accept={{ 'application/pdf': ['.pdf'] }} actionName="Repair PDF" outputExtension="_repaired.pdf" />} />
            <Route path="/pdf-tools/page-numbers" element={<PageNumbersPdf />} />
            <Route path="/pdf-tools/scan" element={<ScanPdf />} />
            <Route path="/pdf-tools/ocr" element={<OcrPdf />} />
            <Route path="/pdf-tools/compare" element={<ComparePdf />} />
            <Route path="/pdf-tools/redact" element={<RedactPdf />} />
            <Route path="/pdf-tools/crop" element={<CropPdf />} />
            <Route path="/pdf-tools/translate" element={<BackendRequiredTool title="Translate PDF" description="Translate the text in your PDF to another language." icon={Languages} accept={{ 'application/pdf': ['.pdf'] }} actionName="Translate PDF" outputExtension="_translated.pdf" />} />
            
            {/* Social Tools */}
            <Route path="/social-tools" element={<SocialTools />} />
            <Route path="/social-tools/instagram-filters" element={<InstagramFilters />} />
            <Route path="/social-tools/instagram-post" element={<InstagramPostGenerator />} />
            <Route path="/social-tools/instagram-story" element={<InstagramStoryGenerator />} />
            <Route path="/social-tools/instagram-downloader" element={<InstagramDownloader />} />
            <Route path="/social-tools/tweet-generator" element={<TweetGenerator />} />
            <Route path="/social-tools/tweet-to-image" element={<TweetToImage />} />
            <Route path="/social-tools/twitter-ad-revenue" element={<TwitterAdRevenue />} />
            <Route path="/social-tools/youtube-thumbnail" element={<YouTubeThumbnail />} />
            <Route path="/social-tools/vimeo-thumbnail" element={<VimeoThumbnail />} />
            <Route path="/social-tools/open-graph" element={<OpenGraphGenerator />} />

            {/* Encryption Tools */}
            <Route path="/encryption-tools" element={<EncryptionTools />} />
            <Route path="/encryption-tools/base64" element={<Base64Tool />} />
            <Route path="/encryption-tools/md5-hash" element={<HashTool algorithm="MD5" title="MD5 Hash" description="Use this tool to generate MD5 hashes from text." />} />
            <Route path="/encryption-tools/md5-decrypt" element={<HashDecryptTool algorithm="MD5" title="MD5 Decrypt" description="Use this tool to decrypt MD5 hashes." />} />
            <Route path="/encryption-tools/sha1-hash" element={<HashTool algorithm="SHA1" title="SHA1 Hash" description="Use this tool to generate SHA1 hashes from text." />} />
            <Route path="/encryption-tools/sha1-decrypt" element={<HashDecryptTool algorithm="SHA1" title="SHA1 Decrypt" description="Use this tool to decrypt SHA1 hashes." />} />
            <Route path="/encryption-tools/sha256-hash" element={<HashTool algorithm="SHA256" title="SHA256 Hash" description="Use this tool to generate SHA256 hashes from text." />} />
            <Route path="/encryption-tools/sha256-decrypt" element={<HashDecryptTool algorithm="SHA256" title="SHA256 Decrypt" description="Use this tool to decrypt SHA256 hashes." />} />
            <Route path="/encryption-tools/sha384-hash" element={<HashTool algorithm="SHA384" title="SHA384 Hash" description="Use this tool to generate SHA384 hashes from text." />} />
            <Route path="/encryption-tools/sha384-decrypt" element={<HashDecryptTool algorithm="SHA384" title="SHA384 Decrypt" description="Use this tool to decrypt SHA384 hashes." />} />
            <Route path="/encryption-tools/sha512-hash" element={<HashTool algorithm="SHA512" title="SHA512 Hash" description="Use this tool to generate SHA512 hashes from text." />} />
            <Route path="/encryption-tools/sha512-decrypt" element={<HashDecryptTool algorithm="SHA512" title="SHA512 Decrypt" description="Use this tool to decrypt SHA512 hashes." />} />
            <Route path="/encryption-tools/aes-encrypt" element={<SymmetricCryptoTool algorithm="AES" mode="encrypt" title="AES Encrypt" description="Use this tool to generate AES hashes from text." />} />
            <Route path="/encryption-tools/aes-decrypt" element={<SymmetricCryptoTool algorithm="AES" mode="decrypt" title="AES Decrypt" description="Use this tool to decrypt AES hashes." />} />
            <Route path="/encryption-tools/des-encrypt" element={<SymmetricCryptoTool algorithm="DES" mode="encrypt" title="DES Encrypt" description="Use this tool to generate DES hashes from text." />} />
            <Route path="/encryption-tools/des-decrypt" element={<SymmetricCryptoTool algorithm="DES" mode="decrypt" title="DES Decrypt" description="Use this tool to decrypt DES hashes." />} />
            <Route path="/encryption-tools/ripemd160-encrypt" element={<HashTool algorithm="RIPEMD160" title="RIPEMD160 Encrypt" description="Use this tool to generate RIPEMD160 hashes from text." />} />
            <Route path="/encryption-tools/url-encode" element={<EncodeDecodeTool format="URL" mode="encode" title="URL Encode" description="Url Encode is a tool that allows you to encode URL parameters to send data to server." />} />
            <Route path="/encryption-tools/url-decode" element={<EncodeDecodeTool format="URL" mode="decode" title="URL Decode" description="Url Encode is a tool that allows you to decode URL parameters to Plain and readable text." />} />
            <Route path="/encryption-tools/html-encode" element={<EncodeDecodeTool format="HTML" mode="encode" title="HTML Encode" description="Html Encode is a tool that allows you to encode plain HTML to encoded html." />} />
            <Route path="/encryption-tools/html-decode" element={<EncodeDecodeTool format="HTML" mode="decode" title="HTML Decode" description="Html Decode is a tool that allows you to decode html into plain HTML." />} />

            {/* Color Tools */}
            <Route path="/color-tools" element={<ColorTools />} />
            <Route path="/color-tools/ai-palette" element={<AIPaletteGenerator />} />
            <Route path="/color-tools/hex-to-rgba" element={<HexToRgba />} />
            <Route path="/color-tools/rgba-to-hex" element={<RgbaToHex />} />
            <Route path="/color-tools/shades" element={<ColorShades />} />
            <Route path="/color-tools/mixer" element={<ColorMixer />} />

            {/* Coding Tools */}
            <Route path="/coding-tools" element={<CodingTools />} />
            <Route path="/coding-tools/code-to-image" element={<CodeToImage />} />
            <Route path="/coding-tools/slug-generator" element={<SlugGenerator />} />
            <Route path="/coding-tools/rn-shadow" element={<RNShadowGenerator />} />
            <Route path="/coding-tools/html-minifier" element={<HtmlMinifier />} />
            <Route path="/coding-tools/css-minifier" element={<CssMinifier />} />
            <Route path="/coding-tools/js-minifier" element={<JsMinifier />} />
            <Route path="/coding-tools/html-formatter" element={<HtmlFormatter />} />
            <Route path="/coding-tools/css-formatter" element={<CssFormatter />} />
            <Route path="/coding-tools/js-formatter" element={<JsFormatter />} />
            <Route path="/coding-tools/json-viewer" element={<JsonViewer />} />
            <Route path="/coding-tools/css-loader-generator" element={<CssLoaderGenerator />} />
            <Route path="/coding-tools/css-checkbox-generator" element={<CssCheckboxGenerator />} />
            <Route path="/coding-tools/css-switch-generator" element={<CssSwitchGenerator />} />
            <Route path="/coding-tools/css-clip-path-generator" element={<CssClipPathGenerator />} />
            <Route path="/coding-tools/css-background-pattern-generator" element={<CssBackgroundPatternGenerator />} />
            <Route path="/coding-tools/css-cubic-bezier-generator" element={<CssCubicBezierGenerator />} />
            <Route path="/coding-tools/css-glassmorphism-generator" element={<CssGlassmorphismGenerator />} />
            <Route path="/coding-tools/css-text-glitch-generator" element={<CssTextGlitchGenerator />} />
            <Route path="/coding-tools/css-gradient-generator" element={<CssGradientGenerator />} />
            <Route path="/coding-tools/css-triangle-generator" element={<CssTriangleGenerator />} />
            <Route path="/coding-tools/css-box-shadow-generator" element={<CssBoxShadowGenerator />} />
            <Route path="/coding-tools/css-border-radius-generator" element={<CssBorderRadiusGenerator />} />
            <Route path="/coding-tools/css-text-shadow-generator" element={<CssTextShadowGenerator />} />
            
            {/* Convert Website To App */}
            <Route path="/convert-website-to-app" element={<ConvertWebsiteToApp />} />
            <Route path="/app-builder" element={<AppBuilder />} />
            
            {/* PaperMe */}
            <Route path="/paperme" element={<PaperMe />} />
          </Route>
          
          {/* Standalone PWA Install Page */}
          <Route path="/pwa/:id" element={<PwaInstallPage />} />
          <Route path="/pwa" element={<PwaInstallPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
