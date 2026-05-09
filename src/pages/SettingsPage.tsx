import React, { useState } from 'react';
import { User, Bell, Shield, CircleHelp, LogOut, ChevronRight, RefreshCw, Download } from 'lucide-react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';

const menuItems = [
  { icon: User, label: 'Profile Settings', sub: 'Manage your warteg info' },
  { icon: Bell, label: 'Notifications', sub: 'Daily summary & alerts' },
  { icon: Shield, label: 'Security', sub: 'PIN & Biometric' },
  { icon: CircleHelp, label: 'Help Center', sub: 'Contact support' },
];

export const SettingsPage: React.FC = () => {
  const [checking, setChecking] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const currentFullVersion = `v${__APP_VERSION__}-${__BUILD_NUMBER__}`;

  const checkUpdate = async () => {
    if (downloading) return;
    setChecking(true);
    try {
      const response = await fetch('https://api.github.com/repos/rizkyfauzi-git/lugh-mobile-app/releases/latest');
      const data = await response.json();
      
      if (data.tag_name) {
        const latestFullVersion = data.tag_name;
        
        if (latestFullVersion !== currentFullVersion) {
          const downloadUrl = data.assets[0]?.browser_download_url;
          if (downloadUrl && confirm(`New update ${latestFullVersion} is available! Download and install now?`)) {
            startDownload(downloadUrl, latestFullVersion);
          }
        } else {
          alert('You are already using the latest build.');
        }
      }
    } catch (error) {
      alert('Failed to check for updates. Please try again later.');
    } finally {
      setChecking(false);
    }
  };

  const startDownload = async (url: string, version: string) => {
    setDownloading(true);
    setProgress(0);
    try {
      const fileName = `LughFinance_${version}.apk`;
      
      // We use a listener-based approach for progress if possible, 
      // but for simplicity with Filesystem.downloadFile in standard Capacitor:
      const downloadResult = await Filesystem.downloadFile({
        url: url,
        path: fileName,
        directory: Directory.Data,
        progress: true,
      });

      if (downloadResult.path) {
        setProgress(100);
        // Small delay to show 100%
        setTimeout(async () => {
          try {
            await FileOpener.open({
              filePath: downloadResult.path!,
              contentType: 'application/vnd.android.package-archive'
            });
          } catch (e) {
            alert('Failed to open installer. Please find the APK in your downloads.');
          }
          setDownloading(false);
        }, 500);
      }
    } catch (error) {
      alert('Download failed. Please check your connection.');
      setDownloading(false);
    }
  };

  return (
    <div className="p-6 pt-6 pb-32">
      <h2 className="text-xl font-bold font-heading text-slate-900 mb-6">Settings</h2>
      
      <div className="space-y-4">
        {/* Update Card */}
        <div className="w-full bg-emerald-50 border border-emerald-100 p-4 rounded-3xl overflow-hidden relative">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white text-emerald-600 shadow-sm">
                {downloading ? <Download size={20} className="animate-bounce" /> : <RefreshCw size={20} className={checking ? 'animate-spin' : ''} />}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900">
                  {downloading ? 'Downloading Update...' : 'Check for Update'}
                </p>
                <p className="text-[10px] font-medium text-emerald-600">Current {currentFullVersion}</p>
              </div>
            </div>
            {!downloading && (
              <button 
                onClick={checkUpdate}
                disabled={checking}
                className="p-2 rounded-xl bg-emerald-100 text-emerald-700 active:scale-95 transition-transform"
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>

          {downloading && (
            <div className="mt-4 relative z-10">
              <div className="w-full bg-emerald-200/50 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${progress || 10}%` }} // Default 10% for feedback if progress is indeterminate
                ></div>
              </div>
              <p className="text-[9px] font-bold text-emerald-700 mt-2 text-right uppercase tracking-wider">
                {progress > 0 ? `${progress}% Completed` : 'Connecting...'}
              </p>
            </div>
          )}
        </div>

        {menuItems.map((item) => (
          <button key={item.label} className="w-full glass p-4 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-slate-50 text-slate-600">
                <item.icon size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900">{item.label}</p>
                <p className="text-[10px] font-medium text-slate-400">{item.sub}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        ))}

        <button className="w-full p-4 rounded-3xl flex items-center justify-center gap-2 text-rose-500 font-bold text-sm mt-8 border border-rose-100 bg-rose-50/30">
          <LogOut size={18} />
          Logout Account
        </button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Lugh Finance {currentFullVersion}</p>
      </div>
    </div>
  );
};
