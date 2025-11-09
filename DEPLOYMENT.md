# دليل النشر - CARVFi Platform

## نشر Frontend على Vercel (مجاناً)

### الخطوات:

1. **إنشاء حساب على Vercel**
   - اذهب إلى: https://vercel.com/signup
   - سجل دخول باستخدام GitHub

2. **رفع المشروع على GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/CARVFi.git
   git push -u origin main
   ```

3. **نشر على Vercel**
   - اذهب إلى: https://vercel.com/new
   - اختر المستودع: CARVFi
   - ضع الإعدادات التالية:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

4. **إضافة متغيرات البيئة**
   - في لوحة تحكم Vercel، اذهب إلى Settings > Environment Variables
   - أضف:
     - `VITE_API_URL`: رابط الـ Backend من Render (سيكون متاحاً بعد نشر Backend)

5. **انقر Deploy**

---

## نشر Backend على Render (مجاناً)

### الخطوات:

1. **إنشاء حساب على Render**
   - اذهب إلى: https://render.com/register
   - سجل دخول باستخدام GitHub

2. **إنشاء Web Service**
   - اذهب إلى: https://dashboard.render.com/
   - انقر "New +" > "Web Service"
   - اختر المستودع: CARVFi
   - ضع الإعدادات التالية:
     - **Name**: carvfi-backend
     - **Region**: اختر الأقرب لك
     - **Root Directory**: `backend`
     - **Runtime**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **إضافة متغيرات البيئة**
   - في صفحة الإنشاء، انزل إلى Environment Variables
   - أضف:
     - `MONGO_URI`: رابط MongoDB (انظر الخطوات أدناه)
     - `PORT`: 10000
     - `NODE_ENV`: production

4. **انقر Create Web Service**

---

## إعداد قاعدة البيانات MongoDB (مجاناً)

### الخطوات:

1. **إنشاء حساب على MongoDB Atlas**
   - اذهب إلى: https://www.mongodb.com/cloud/atlas/register
   - سجل حساب جديد

2. **إنشاء Cluster مجاني**
   - اختر "Create a Deployment"
   - اختر "M0 FREE" plan
   - اختر المنطقة الأقرب لك
   - انقر "Create Deployment"

3. **إنشاء Database User**
   - اختر اسم مستخدم وكلمة مرور
   - احفظهم في مكان آمن

4. **إضافة Network Access**
   - اذهب إلى Network Access
   - انقر "Add IP Address"
   - اختر "Allow Access from Anywhere" (0.0.0.0/0)
   - انقر Confirm

5. **الحصول على Connection String**
   - اذهب إلى Database > Connect
   - اختر "Connect your application"
   - انسخ الـ Connection String
   - استبدل `<password>` بكلمة المرور الخاصة بك
   - مثال: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/carvfi?retryWrites=true&w=majority`

6. **أضف هذا الرابط في متغيرات Render**
   - ارجع إلى Render Dashboard
   - اذهب إلى Environment Variables
   - أضف `MONGO_URI` مع الرابط

---

## تحديث Frontend بعد نشر Backend

بعد نشر Backend على Render، ستحصل على رابط مثل:
`https://carvfi-backend.onrender.com`

1. اذهب إلى Vercel Dashboard
2. افتح مشروعك
3. اذهب إلى Settings > Environment Variables
4. حدث `VITE_API_URL` إلى: `https://carvfi-backend.onrender.com/api`
5. اذهب إلى Deployments وانقر Redeploy

---

## الروابط النهائية

بعد إتمام جميع الخطوات، ستحصل على:

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://carvfi-backend.onrender.com`

---

## ملاحظات مهمة

1. **Render Free Plan**: يدخل في وضع السكون بعد 15 دقيقة من عدم الاستخدام. أول طلب سيأخذ 30-60 ثانية.

2. **MongoDB Atlas Free**: يوفر 512 MB تخزين مجاني.

3. **Vercel Free**: يوفر 100 GB bandwidth شهرياً.

4. **تحديث الكود**:
   - عند رفع تحديثات على GitHub، Vercel و Render سيقومون بإعادة النشر تلقائياً.

---

## استكشاف الأخطاء

### إذا لم يعمل Frontend:
- تأكد من صحة `VITE_API_URL`
- افتح Console في المتصفح لرؤية الأخطاء

### إذا لم يعمل Backend:
- تأكد من صحة `MONGO_URI`
- افتح Render Logs لرؤية الأخطاء

### إذا كانت قاعدة البيانات لا تتصل:
- تأكد من إضافة IP Address (0.0.0.0/0) في MongoDB Atlas
- تأكد من استبدال `<password>` في Connection String
