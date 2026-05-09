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
      
      const downloadResult = await Filesystem.downloadFile({
        url: url,
        path: fileName,
        directory: Directory.Data,
        progress: true,
      });

      if (downloadResult.path) {
        setProgress(100);
        // Change status to Installing
        const installPath = downloadResult.path;
        
        // Brief pause to show 100%
        setTimeout(async () => {
          try {
            // Provide feedback that we are launching the installer
            alert(`Download complete! Click OK to start installation. The app will restart after the update.`);
            
            await FileOpener.open({
              filePath: installPath!,
              contentType: 'application/vnd.android.package-archive'
            });
          } catch (e) {
            alert('Failed to open installer. Please find the APK in your Internal Storage > Android > data > [package_name] > files');
          }
          setDownloading(false);
          setProgress(0);
        }, 500);
      }
    } catch (error) {
      alert('Download failed. Please check your connection.');
      setDownloading(false);
      setProgress(0);
    }
  };

  return (
    <div className="p-6 pt-4 pb-32">
      <div className="space-y-4">
        {/* Update Card */}
        <div className="w-full bg-emerald-50 border border-emerald-100 p-4 rounded-3xl overflow-hidden relative">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white text-emerald-600 shadow-sm">
                {downloading ? (
                  <div className="relative">
                    <Download size={20} className={progress < 100 ? 'animate-bounce' : ''} />
                    {progress === 100 && <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>}
                  </div>
                ) : (
                  <RefreshCw size={20} className={checking ? 'animate-spin' : ''} />
                )}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900">
                  {downloading 
                    ? (progress === 100 ? 'Ready to Install' : 'Downloading Update...') 
                    : 'Check for Update'}
                </p>
                <p className="text-[10px] font-medium text-emerald-600">
                  {downloading ? (progress === 100 ? 'Click OK to continue' : `${progress || 10}% downloaded`) : `Current ${currentFullVersion}`}
                </p>
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
                  className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-blue-500' : 'bg-emerald-500'}`}
                  style={{ width: `${progress || 10}%` }}
                ></div>
              </div>
              <p className={`text-[9px] font-bold mt-2 text-right uppercase tracking-wider ${progress === 100 ? 'text-blue-600' : 'text-emerald-700'}`}>
                {progress === 100 ? 'Download Success' : 'Downloading...'}
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
