# Brewlab — Figma Design System & Architecture Specification

এই ডকুমেন্টটি **Brewlab Coffee Shop** প্রজেক্টের সম্পূর্ণ ফিগমা (Figma) আর্কিটেকচার, ডিজাইন টোকেন, অটো-লেআউট এবং কম্পোনেন্ট স্পেসিফিকেশন নির্দেশিকা।

---

## ১. ফিগমা আর্কিটেকচার ও ফাইল স্ট্রাকচার (Figma File Pages)

```
📁 Brewlab Design System (Figma File)
│
├── 🎨 01. Cover & Overview (Project metadata, changelog, versioning)
├── 🔤 02. Foundations (Color styles, Typography, Spacing, Shadows, Grid)
├── 🧩 03. Components & Variants (Buttons, Badges, Cards, Nav, Footer, Forms)
├── 📱 04. Wireframes & UX Flows (User journey from hero to checkout)
├── 💻 05. Desktop Pages (1440px Canvas: Home, Style Guide, 404, License)
├── 📱 06. Mobile & Responsive (390px Canvas: Responsive breakdowns)
└── 🗄️ 07. Assets & Export (Icons, Vectors, Cutouts, Social cards)
```

---

## ২. কালার স্টাইলস (Figma Color Styles)

| Style Name | Hex Code | Figma Role & Usage |
| :--- | :--- | :--- |
| `Brand/Primary` | `#482820` | মেইন হেডিং, ডার্ক রোস্ট কফি বাটন, ফুটার টেক্সট |
| `Brand/Secondary` | `#FEBD02` | গোল্ডেন অ্যাম্বার ক্রেমা অ্যাকসেন্ট, স্টার রেটিং, ব্যাজ |
| `Brand/Background` | `#F8F5F1` | মেইন ক্যানভাস ব্যাকগ্রাউন্ড (ওট মিল্ক ক্রিম) |
| `Brand/Accent` | `#F85119` | হট অ্যাকসেন্ট, ডিসকাউন্ট ট্যাগ, স্পেশাল অফার |
| `Brand/White` | `#FFFFFF` | প্রোডাক্ট কার্ড, মোডাল সারফেস, কনটেইনার |
| `Neutral/Dark` | `#111827` | হেভি বডি টেক্সট (Gray 900) |
| `Neutral/Muted` | `#6B7280` | মেটা টেক্সট ও ডিসক্লেইমার (Gray 500) |
| `Neutral/Border` | `#E5E7EB` | ডিভাইডার এবং ইনপুট বর্ডার (Gray 200) |

---

## ৩. টাইপোগ্রাফি স্টাইলস (Figma Text Styles)

### Display & Headings (Font: Tanker Regular)
* **Display H1:** `Tanker / 120px` (Line height: 86%, Letter-spacing: -2%)
* **Heading H2:** `Tanker / 68px` (Line height: 100%, Letter-spacing: -1.5%)
* **Heading H3:** `Tanker / 48px` (Line height: 110%, Letter-spacing: -1%)
* **Heading H4:** `Tanker / 36px` (Line height: 110%, Letter-spacing: 0%)
* **Heading H5:** `Tanker / 28px` (Line height: 120%)
* **Heading H6:** `Tanker / 22px` (Line height: 130%)

### Body & UI Copy (Font: Interdisplay / Inter)
* **Body Large:** `Inter / 18px Medium (500)` (Line height: 140%)
* **Body Regular:** `Inter / 16px Regular (400)` (Line height: 150%)
* **Body Small:** `Inter / 14px Regular (400)` (Line height: 140%)
* **Caption / Button:** `Inter / 14px SemiBold (600)` (Line height: 100%, Uppercase)

### Signature Handwritten (Font: Smooch)
* **Special Script:** `Smooch / 32px Regular` (Cursive Accent, Rotation -4deg)

---

## ৪. গ্রিড এবং ব্রেকপয়েন্টস (Layout Grids)

* **Desktop (1440px Canvas):**
  * Grid: 12 Columns
  * Max Content Width: `1280px`
  * Gutter: `24px`
  * Margin: `80px`
* **Tablet (834px Canvas):**
  * Grid: 8 Columns
  * Gutter: `20px`
  * Margin: `32px`
* **Mobile (390px Canvas):**
  * Grid: 4 Columns
  * Gutter: `16px`
  * Margin: `20px`

---

## ৫. মূল কম্পোনেন্ট এবং ভেরিয়েন্ট ম্যাট্রিক্স (Component Variants)

### বাটন কম্পোনেন্ট (`Button`)
* **Variants:**
  * `Variant`: Primary (`#482820`), Secondary (`#FEBD02`), Ghost/Outline, Icon-Only
  * `State`: Default, Hover, Focused, Disabled
  * `Size`: Large (56px height, 32px padding), Medium (48px height, 24px padding), Small (40px height, 16px padding)
* **Micro-Interaction In Figma:**
  * Interactive Component with Smart Animate (Ease-out 250ms)
  * Dual-layer sliding pill effect

### প্রোডাক্ট কার্ড কম্পোনেন্ট (`ProductCard`)
* **Structure (AutoLayout Vertical, 16px gap, 24px padding, 24px radius, #FFFFFF background):**
  1. Image Container (with floating discount/roast badge)
  2. Product Title (`H4`), Short Tasting Notes (`Body Small`)
  3. Price Tag (`H5`) + Quick Add to Cart Button (`Button/Small`)

---

## ৬. ফিগমা থেকে কোডে এক্সপোর্ট (Figma-to-Code Workflow)
1. ফিগমার ভেরিয়েবলস এবং স্টাইলসগুলো `tokens/tokens.json`-এর মাধ্যমে সরাসরি `css/design-tokens.css`-এ সিঙ্ক করা হয়েছে।
2. কোনো স্টাইল পরিবর্তন করতে চাইলে `tokens.json` আপডেট করে বিল্ড করলেই সম্পূর্ণ প্রজেক্টের থিম আপডেট হয়ে যাবে।
