import { useState, useRef } from 'react';
import { Link, FileText, ArrowRight, Loader2, UploadCloud, File as FileIcon, X, AlertCircle } from 'lucide-react';
import { extractTextFromPDF } from '../../utils/pdfParser';
import type { AnalysisStatus } from '../../types/analysis';

interface Props {
  status: AnalysisStatus;
  onAnalyze: (input: string, isUrl: boolean, customResumeText?: string) => void;
}

export function JDInput({ status, onAnalyze }: Props) {
  const [mode, setMode] = useState<'text' | 'url'>('text');
  const [resumeSource, setResumeSource] = useState<'builder' | 'pdf'>('builder');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLoading = status === 'fetching-jd' || status === 'analyzing' || isParsing;
  const currentInput = mode === 'text' ? text : url;
  const canSubmit = currentInput.trim().length > 0 && 
    (resumeSource === 'builder' || (resumeSource === 'pdf' && pdfFile)) && 
    !isLoading;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPdfError('');
    if (file) {
      if (file.type !== 'application/pdf') {
        setPdfError('请上传 PDF 格式的文件');
        return;
      }
      setPdfFile(file);
    }
  };

  const handleRemoveFile = () => {
    setPdfFile(null);
    setPdfError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    
    let customText: string | undefined;
    
    if (resumeSource === 'pdf' && pdfFile) {
      setIsParsing(true);
      setPdfError('');
      try {
        customText = await extractTextFromPDF(pdfFile);
        if (!customText || customText.length < 50) {
          throw new Error('未提取到足够的文本内容，可能是扫描版 PDF');
        }
      } catch (err: unknown) {
        setPdfError((err as Error).message || 'PDF 解析失败');
        setIsParsing(false);
        return;
      }
      setIsParsing(false);
    }

    onAnalyze(currentInput.trim(), mode === 'url', customText);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* 简历来源 */}
      <div className="flex flex-col gap-2.5">
        <label className="text-[12px] font-semibold text-[#666]">选择要分析的简历</label>
        <div className="flex gap-1 p-0.5 bg-[#f5f5f5] rounded-lg w-fit">
          <button
            className={`btn text-[12px] px-3 py-1.5 rounded-md transition-all ${
              resumeSource === 'builder' ? 'bg-white shadow-sm text-black font-medium' : 'text-[#999] hover:text-[#666]'
            }`}
            onClick={() => setResumeSource('builder')}
          >
            当前编辑的简历
          </button>
          <button
            className={`btn text-[12px] px-3 py-1.5 rounded-md transition-all ${
              resumeSource === 'pdf' ? 'bg-white shadow-sm text-black font-medium' : 'text-[#999] hover:text-[#666]'
            }`}
            onClick={() => setResumeSource('pdf')}
          >
            上传 PDF
          </button>
        </div>

        {/* PDF 上传区 */}
        {resumeSource === 'pdf' && (
          <div className="mt-2">
            {!pdfFile ? (
              <div 
                className="border-2 border-dashed border-[#e6e6e6] rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#aaa] hover:bg-[#fafafa] transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud size={24} className="text-[#bbb]" />
                <div className="text-center">
                  <p className="text-[13px] font-medium text-[#333]">点击选择或拖拽 PDF 文件</p>
                  <p className="text-[11px] text-[#999] mt-0.5">支持纯文本 PDF 的解析</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 bg-[#f8f9fa] border border-[#eee] rounded-xl">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded bg-white flex items-center justify-center shrink-0 shadow-sm text-red-500">
                    <FileIcon size={16} />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[13px] font-medium text-[#333] truncate">{pdfFile.name}</span>
                    <span className="text-[11px] text-[#999]">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
                <button 
                  className="btn-icon p-1.5 hover:bg-white hover:text-red-500 rounded-lg shrink-0" 
                  onClick={handleRemoveFile}
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {pdfError && <p className="text-[12px] text-red-500 mt-2 flex items-center gap-1"><AlertCircle size={12}/>{pdfError}</p>}
          </div>
        )}
      </div>

      <div className="divider" />

      {/* JD 输入 */}
      <div className="flex flex-col gap-2.5">
        <label className="text-[12px] font-semibold text-[#666]">输入目标岗位要求 (JD)</label>
        
        {/* Mode toggle */}
        <div className="flex gap-1 p-0.5 bg-[#f5f5f5] rounded-lg w-fit">
          <button
            className={`btn text-[12px] px-3 py-1.5 rounded-md transition-all ${
              mode === 'text' ? 'bg-white shadow-sm text-black font-medium' : 'text-[#999] hover:text-[#666]'
            }`}
            onClick={() => setMode('text')}
          >
            <FileText size={13} /> 文本
          </button>
          <button
            className={`btn text-[12px] px-3 py-1.5 rounded-md transition-all ${
              mode === 'url' ? 'bg-white shadow-sm text-black font-medium' : 'text-[#999] hover:text-[#666]'
            }`}
            onClick={() => setMode('url')}
          >
            <Link size={13} /> 链接
          </button>
        </div>

        {/* Input area */}
        {mode === 'text' ? (
          <textarea
            className="input-field w-full text-[13px] resize-none border border-[#eee] rounded-lg !p-3 mt-1"
            style={{ minHeight: '160px', lineHeight: '1.7', borderBottom: '1px solid #eee' }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="在此粘贴完整的岗位描述 (JD)..."
            disabled={isLoading}
          />
        ) : (
          <input
            type="url"
            className="input-field text-[13px] border border-[#eee] rounded-lg !p-3 mt-1"
            style={{ borderBottom: '1px solid #eee' }}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="粘贴招聘页面链接，如 https://..."
            disabled={isLoading}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        )}
      </div>

      {/* Submit */}
      <button
        className="btn btn-primary w-full mt-2"
        onClick={handleSubmit}
        disabled={!canSubmit}
        style={{ opacity: canSubmit ? 1 : 0.4 }}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {isParsing ? '正在解析 PDF...' : status === 'fetching-jd' ? '正在获取岗位信息...' : '正在分析...'}
          </>
        ) : (
          <>
            开始分析 <ArrowRight size={16} />
          </>
        )}
      </button>
    </div>
  );
}
