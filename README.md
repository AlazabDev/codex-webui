# Codex WebUI

[![GHCR](https://img.shields.io/badge/GHCR-codex--webui-blue?logo=github)](https://github.com/LimLLL/codex-webui/pkgs/container/codex-webui)
[![Docker](https://img.shields.io/badge/docker-multi--arch-brightgreen?logo=docker)](./Dockerfile)

واجهة ويب أمامية لـ [OpenAI Codex CLI](https://github.com/openai/codex). تنقل التفاعل من سطر الأوامر إلى المتصفح، وتدعم تعدد الخيوط المتزامنة وإدارة الملفات والطرفية ومتجر الإضافات وغيرها.

الخادم الخلفي مبني بـ NestJS ويتواصل مع `codex app-server` عبر stdio JSON-RPC، والواجهة الأمامية React + Vite، وبينهما Socket.IO للدفع اللحظي.

[English](./README.en.md)

| | |
|:--:|:--:|
| <img src="./images/main.png" width="440" alt="المحادثة والخيوط"><br>**المحادثة والخيوط** | <img src="./images/branches.png" width="440" alt="التفرعات على مستوى الرسالة"><br>**التفرعات على مستوى الرسالة** |
| <img src="./images/approval.png" width="440" alt="مسار الموافقة"><br>**مسار الموافقة** | <img src="./images/files.png" width="440" alt="إدارة الملفات والمعاينة"><br>**إدارة الملفات والمعاينة** |
| <img src="./images/terminal.png" width="440" alt="الطرفية"><br>**الطرفية** | <img src="./images/integrations.png" width="440" alt="التكاملات والإضافات"><br>**التكاملات والإضافات** |

## الميزات

**المحادثة والخيوط**
- تشغيل عدة خيوط بشكل متزامن دون تداخل
- تجميع الخيوط حسب مساحة العمل، مع دعم الأرشفة والتفرع وإعادة التسمية
- عرض Markdown + تمييز الشيفرة عبر Shiki
- إدراج الملفات بـ `@` ولصق الصور
- التتبع (steer) ومقاطعة (stop) الدور الجاري تنفيذه

**التفرعات على مستوى الرسالة**
- تحرير أي رسالة سابقة يُنشئ نسخة جديدة، مع إمكانية التنقل يمينًا ويسارًا بين النسخ كما في ChatGPT
- رسم بياني للتفرعات يعرض شجرة المحادثة كاملة، مع تمييز نقاط التشعب وحالة التشغيل والموافقات المعلّقة
- الحذف المتسلسل: حذف فرع يحذف كل ما يتفرع عنه، وقبل الحذف تُعرض بالرسم وال قائمة المجموعة الدقيقة التي ستُحذف
- عند بدء التشغيل يُجرى مسح لسجلات rollout لاستعادة التفرعات التي أُنشئت خارج WebUI (مثل CLI)

**مسار الموافقة**
- بطاقات موافقة لتنفيذ الأوامر وتغييرات الملفات، تُدار مباشرة من الصفحة
- دعم تبديل سياسة الأمان (مستوى sandbox)
- حماية CAS من التعارض عند اتصال عدة أجهزة في الوقت نفسه

**إدارة الملفات والمعاينة**
- متصفح ملفات شجري مع دعم السحب والإفلات للنقل
- محرر Monaco Editor + مقارنة Git diff بعرض مقسوم
- معاينة الملفات: PDF والصور والفيديو والصوت والخطوط والملفات الثنائية (hex dump)
- تصفح الأرشيفات: ZIP / TAR(.gz/.bz2/.xz) / RAR / 7z دون فك الضغط
- تحرير مستندات Office: DOCX / XLSX / PPTX (عبر OnlyOffice Document Server، تكامل اختياري)
- رفع / تنزيل / إعادة تسمية / نسخ / نقل / إنشاء مجلد

**الطرفية**
- طرفية مشتركة متعددة التبويبات (node-pty + xterm.js)
- إعادة الاتصال بعد الانقطاع دون فقدان المخرجات
- إعادة تشغيل headless VT

**التكاملات والإضافات**
- متجر الإضافات: تصفح وتثبيت وإزالة، مع مزامنة الإضافات المثبتة محليًا
- خوادم MCP: عرض الحالة وإعادة تحميل شاملة وتسجيل الدخول عبر OAuth
- التطبيقات / الموصلات: عرض الموصلات المتاحة وقائمة أدواتها (تجريبي)

**أخرى**
- مصادقة JWT + API Key
- إدارة الإضافات/خوادم MCP
- سمة داكنة/فاتحة، تبديل بين العربية والإنجليزية
- تصميم متجاوب يعمل على الهاتف واللوحي
- نشر بنقرة واحدة عبر Docker

## التقنيات المستخدمة

```
المتصفح
  React 19 · Vite 8 · TanStack (Router + Query + Virtual)
  Zustand · Socket.IO Client · Monaco Editor · xterm.js
  Tailwind CSS 4 · shadcn/ui · Framer Motion · dnd-kit
  React Flow (@xyflow/react) + d3-hierarchy (رسم التفرعات)
     ↕  REST + WebSocket
الخادم الخلفي
  NestJS 11 · Fastify 5 · Socket.IO · node-pty
  SQLite (better-sqlite3 + Drizzle ORM) · Pino
     ↕  stdio JSON-RPC
  codex app-server (عملية فرعية)

الاختبارات
  Vitest (موحّد للواجهة والخادم) · SWC (بيانات وصفية للديكوريتور في الخادم)
  jsdom + Testing Library (مكونات الواجهة)
```

## البدء السريع

### المتطلبات المسبقة

- Node.js >= 20
- pnpm >= 9
- [Codex CLI](https://github.com/openai/codex) مثبّت وجاهز للاستخدام

### النشر عبر Docker (موصى به)

اسحب الصورة مباشرة من GHCR دون بناء محلي:

```bash
# إنشاء ملف .env
cat <<EOF > .env
WEBUI_API_KEY=your-secret-key
OPENAI_API_KEY=sk-xxx
EOF

# التشغيل (سحب تلقائي لصورة متعددة المعماريات)
docker compose up -d
```

أو التشغيل يدويًا:

```bash
docker run -d --name codex-webui \
  -p 8172:8172 \
  -e WEBUI_API_KEY=your-secret-key \
  -e OPENAI_API_KEY=sk-xxx \
  -v codex_root:/root \
  -v codex_workspaces:/workspaces \
  ghcr.io/limlll/codex-webui:latest
```

تعمل الخدمة على `http://localhost:8172`.

> وحدة التخزين `/root` تحفظ إعدادات codex/claude/MCP وسلسلة الأدوات وقت التشغيل. عند أول تشغيل تُستخرج البذرة المدمجة تلقائيًا.

### التطوير المحلي

```bash
git clone https://github.com/LimLLL/codex-webui.git
cd codex-webui
pnpm install

cp .env.example .env
# حرّر .env، واضبط WEBUI_API_KEY على الأقل

# تشغيل الخادم الخلفي (المنفذ الافتراضي 8172)
pnpm start:dev

# في طرفية أخرى، شغّل الواجهة الأمامية (المنفذ 5173، مع وكيل تلقائي إلى الخادم)
cd web && pnpm dev
```

افتح `http://localhost:5173` للاستخدام.

## متغيرات البيئة

| المتغير | إلزامي | القيمة الافتراضية | الوصف |
|------|:----:|--------|------|
| `WEBUI_API_KEY` | نعم | — | مفتاح تسجيل الدخول، ويُستخدم أيضًا لاشتقاق توقيع JWT |
| `PORT` | لا | `8172` | منفذ استماع الخادم الخلفي |
| `OPENAI_API_KEY` | لا | — | مفتاح OpenAI API عند استخدام Codex لواجهة OpenAI |
| `CODEX_BIN` | لا | `codex` | مسار الملف التنفيذي لـ codex CLI |
| `CODEX_HOME` | لا | `~/.codex` | الدليل الرئيسي لـ Codex |
| `LOG_LEVEL` | لا | `info` | مستوى تسجيل Pino |
| `WEBUI_DB_PATH` | لا | `CODEX_HOME/codex-webui.sqlite` | مسار قاعدة بيانات SQLite |

### إعدادات وقت التشغيل (Runtime Settings)

تم نقل `security.workspaceRoots` و`files.uploadMaxBytes` و`terminal.defaultCwd` و`terminal.maxSessions` و`terminal.graceMs` و`terminal.scrollback` إلى إعدادات وقت التشغيل في SQLite، ويمكن تعديلها من صفحة Settings أو عبر `/api/settings`؛ وتبقى متغيرات البيئة التاريخية بنفس الأسماء فعّالة كقيمة احتياطية عند عدم ضبطها في قاعدة البيانات.
يحتفظ Docker Compose بـ `WORKSPACE_ROOTS=/workspaces` لتوفير قيمة bootstrap احتياطية لـ `/workspaces` الموصول عند أول تشغيل.

## بنية المشروع

```
├── src/                  # الخادم الخلفي NestJS
│   ├── codex/            # إدارة العمليات وعميل JSON-RPC
│   ├── threads/          # عمليات CRUD للخيوط وبوابة WebSocket
│   ├── files/            # عمليات الملفات والتحقق من أمان المسارات
│   ├── terminal/         # طرفية متعددة التبويبات (node-pty)
│   ├── auth/             # مصادقة JWT + API Key
│   ├── database/         # SQLite + Drizzle ORM
│   └── ...               # وحدات أخرى
├── web/                  # الواجهة الأمامية React
│   └── src/
│       ├── routes/       # صفحات TanStack Router
│       ├── components/   # مكونات واجهة المستخدم
│       ├── stores/       # إدارة الحالة Zustand
│       ├── hooks/        # خطافات مخصصة
│       └── generated/    # Hey API SDK (مُولّد تلقائيًا)
├── Dockerfile            # بناء متعدد المراحل + seed root
└── docker-compose.yml
```

## الأوامر الشائعة

```bash
pnpm start:dev          # وضع تطوير الخادم الخلفي
pnpm build              # تجميع الخادم الخلفي
pnpm test               # اختبارات الخادم الخلفي (Vitest)
pnpm test:cov           # اختبارات الخادم الخلفي + التغطية
pnpm lint               # فحص ESLint (يشمل الواجهة الأمامية)
pnpm db:generate        # توليد ترحيل قاعدة البيانات
pnpm db:migrate         # تنفيذ الترحيل
cd web && pnpm dev      # وضع تطوير الواجهة الأمامية
cd web && pnpm build    # بناء الواجهة الأمامية (المخرجات إلى public/)
cd web && pnpm test     # اختبارات الواجهة الأمامية (Vitest + jsdom)
```

## HTTPS / الوكيل العكسي

يستمع Codex WebUI نفسه على HTTP فقط (افتراضيًا `0.0.0.0:8172`)، ويُفضّل في بيئة الإنتاج استخدام وكيل عكسي لإنهاء HTTPS.

> **تنبيه**: `WEBUI_API_KEY` يُنقل كنص صريح عبر HTTP، لذا يجب تمكين HTTPS عند النشر على الإنترنت العام.

### Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name codex.example.com;

    ssl_certificate     /etc/ssl/certs/codex.pem;
    ssl_certificate_key /etc/ssl/private/codex.key;

    client_max_body_size 200m;  # يطابق حد رفع الملفات

    location / {
        proxy_pass http://127.0.0.1:8172;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host  $host;
    }

    # ترقية Socket.IO WebSocket
    location /socket.io/ {
        proxy_pass http://127.0.0.1:8172;
        proxy_http_version 1.1;
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host              $host;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host  $host;
        proxy_read_timeout 300s;
    }
}

server {
    listen 80;
    server_name codex.example.com;
    return 301 https://$host$request_uri;
}
```

عند استخدام Docker Compose، غيّر `proxy_pass` إلى `http://codex-webui:8172`، واستبدل `ports` بـ `expose`.

### النشر في دليل فرعي

يمكن استخدام الصورة نفسها لجذر النطاق وللدليل الفرعي عبر الوكيل (مثل `https://cc.example.com/codex/`) دون إعادة البناء لكل مسار. يحتاج الوكيل في الدليل الفرعي إلى إخبار WebUI بالمسار العام من جهة المتصفح عبر `X-Forwarded-Prefix`:

```bash
docker build \
  --build-arg CODEX_CLI_VERSION=0.153.2 \
  -t codex-webui:0.153.2 .
```

يجب على Nginx الإبقاء على بادئة `/codex/` من جهة المتصفح وإزالتها عند التمرير إلى الخادم الخلفي. علامة `/` في نهاية `location` و`proxy_pass` لا يمكن حذفها:

```nginx
location = /codex {
    return 301 /codex/;
}

location /codex/ {
    proxy_pass http://127.0.0.1:8172/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade    $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host  $host;
    proxy_set_header X-Forwarded-Prefix /codex;
    proxy_read_timeout 300s;
}
```

لا يحتاج الوكيل العكسي على الجذر إلى ضبط `X-Forwarded-Prefix`. يولّد WebUI لكل طلب المسار الأساسي الصحيح للموارد الثابتة ومسارات الواجهة الأمامية وREST API وSocket.IO، لذا تخدم الصورة نفسها الحالتين معًا. عند استخدام OnlyOffice، اضبط `general.publicBaseUrl` على العنوان الكامل مع الدليل الفرعي، مثل `https://cc.example.com/codex`.

### Caddy

يصدر Caddy شهادات Let's Encrypt تلقائيًا ويتعامل مع ترقية WebSocket تلقائيًا:

```caddyfile
codex.example.com {
    reverse_proxy 127.0.0.1:8172
}
```

### ملاحظات OnlyOffice

يحتاج OnlyOffice تحت الوكيل العكسي إلى معرفة العنوان العام للاستدعاء الراجع والحفظ. يكفي أن يمرر الوكيل `X-Forwarded-Proto` / `X-Forwarded-Host` بشكل صحيح ليُكتشف تلقائيًا؛ ويمكن أيضًا ضبط `general.publicBaseUrl` صراحةً من Settings → General.

## المساهمة

نرحّب بالـ issues والـ PRs. راجع [CONTRIBUTING.md](./CONTRIBUTING.md) لإعداد بيئة التطوير ومعايير الشيفرة ومتطلبات الاختبار وآلية الإرسال.

قبل الإبلاغ عن خطأ، تأكد أولًا أن المشكلة في WebUI وليست في Codex CLI نفسه؛ [قالب الأخطاء](./.github/ISSUE_TEMPLATE/bug_report.yml) سيرشدك لتصدير معلومات التشخيص من صفحة Diagnostics.

**لا تُبلغ عن المشكلات الأمنية علنًا**، بل عبر قناة الإبلاغ الخاصة، راجع [SECURITY.md](./SECURITY.md).

## الترخيص

Copyright (C) 2026 LimLLL

هذا المشروع مرخّص بموجب [GNU Affero General Public License v3.0 أو أحدث](./LICENSE) (`AGPL-3.0-or-later`).
