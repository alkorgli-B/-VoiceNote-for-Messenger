import Link from 'next/link';
import { Mic, Zap, MessageCircle, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        {/* Hero */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">جديد للـ Messenger</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            كلامك منظم
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            حول رسائلك الصوتية الطويلة لنصوص منظمة في ثوانٍ
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card hover:shadow-2xl transition-shadow">
            <Mic className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
            <h3 className="font-bold text-lg mb-2">سجل براحتك</h3>
            <p className="text-gray-600">تكلم 5 دقائق بأي لغة</p>
          </div>
          
          <div className="card hover:shadow-2xl transition-shadow">
            <Zap className="w-12 h-12 text-purple-600 mb-4 mx-auto" />
            <h3 className="font-bold text-lg mb-2">تنظيم ذكي</h3>
            <p className="text-gray-600">AI يفصل المواضيع تلقائياً</p>
          </div>
          
          <div className="card hover:shadow-2xl transition-shadow">
            <MessageCircle className="w-12 h-12 text-pink-600 mb-4 mx-auto" />
            <h3 className="font-bold text-lg mb-2">إرسال فوري</h3>
            <p className="text-gray-600">مباشرة لـ Messenger</p>
          </div>
        </div>

        {/* CTA */}
        <Link href="/record" className="btn-primary inline-flex items-center gap-2">
          <Mic className="w-5 h-5" />
          ابدأ الآن مجاناً
        </Link>

        <p className="text-gray-500 mt-4 text-sm">
          لا تحتاج تسجيل • مجاني 100%
        </p>
      </div>
    </div>
  );
}
