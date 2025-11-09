# نشر الموقع بسهولة

## الخطوة 1: نشر على GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/CARVFi.git
git push -u origin main
```

**استبدل `YOUR_USERNAME` باسم المستخدم الخاص بك على GitHub**

---

## الخطوة 2: نشر Backend على Render

1. اذهب إلى: https://render.com/register
2. سجل دخول باستخدام GitHub
3. اضغط **New > Web Service**
4. اختر المستودع **CARVFi**
5. ملء الحقول:
   - **Name**: `carvfi-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. اضغط **Create Web Service**
7. بعد النشر، ستحصل على رابط مثل: `https://carvfi-backend.onrender.com`

**احفظ هذا الرابط ستحتاجه لاحقاً**

---

## الخطوة 3: نشر Frontend على Vercel

1. اذهب إلى: https://vercel.com/signup
2. سجل دخول باستخدام GitHub
3. اضغط **Add New > Project**
4. اختر المستودع **CARVFi**
5. ملء الحقول:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`

6. في **Environment Variables** أضف:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://carvfi-backend.onrender.com/api` (الرابط من الخطوة 2)

7. اضغط **Deploy**

**بعد الانتهاء ستحصل على رابط مثل: `https://your-project.vercel.app`**

---

## ملاحظات

- **Render**: قد يأخذ وقت أطول عند الطلب الأول بسبب وضع السكون
- **Vercel**: الأسرع والأكثر استقراراً
- **قاعدة البيانات**: في الوقت الحالي تستخدم MongoDB محلية - تحتاج إلى إعداد MongoDB Atlas للإنتاج

---

## عند تحديث الكود

ما عليك سوى:
```bash
git add .
git commit -m "Update message"
git push
```

Both Vercel و Render سيقومان بإعادة النشر تلقائياً!
