# 🎥 ProjSim - Projector Brightness Simulator

**ProjSim** is a fast, interactive projector brightness simulator that helps you compare two projectors side-by-side in real-time. Perfect for home theater planning, quick projector comparisons, and sharing realistic brightness expectations before you buy or install hardware.

## 🚀 Features

- **Real-time Comparison**: Compare two projectors simultaneously with instant visual feedback
- **Adjustable Parameters**: Fine-tune screen size, throw distance, viewing distance, and room lighting
- **Brightness Metrics**: View results in foot-lamberts (fL), nits, and a visual brightness score
- **Scene-based Preview**: See how projectors perform in different lighting conditions
- **Preset Scenarios**: Quick-start with common room setups
- **Shareable Links**: Export and share your configuration via URL parameters
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: Built-in theme toggle for comfortable viewing

## 📸 Screenshots

### Desktop View
![Desktop view showing two projectors comparison](https://via.placeholder.com/800x400?text=ProjSim+Desktop+View)

### Mobile View
![Mobile view with collapsible controls](https://via.placeholder.com/400x600?text=ProjSim+Mobile+View)

### Comparison Preview
![Interactive slider showing brightness differences](https://via.placeholder.com/600x300?text=ProjSim+Comparison+Slider)

## 🔧 Tech Stack

- **React 19** with TypeScript for a modern, type-safe codebase
- **Vite** for fast development and production builds
- **Tailwind CSS** for responsive, utility-first styling
- **Radix UI** components for accessible, high-quality UI primitives
- **Recharts** for beautiful data visualization
- **Next-themes** for seamless dark mode support

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
cd app
npm install
```

### Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## 🎯 How It Works

ProjSim calculates projected brightness using the following formula:

```
Foot-Lamberts (fL) = (Projector Lumens × Screen Gain) / (Screen Area in sq ft)
```

The simulator takes into account:
- **Ambient Light**: How room lighting affects perceived brightness
- **Screen Size**: Larger screens require more lumens for the same brightness
- **Throw Distance**: Affects image size and brightness distribution
- **Viewing Conditions**: Different standards for pitch-black, dim, and bright rooms

## 📊 Understanding the Results

### Brightness Guidelines

| Room Condition | Recommended fL | Nits (approx) |
|----------------|----------------|---------------|
| Pitch Black    | 15-35+         | 51-120+       |
| Dim Living Room| 45-65+         | 154-222+      |
| Bright Room    | 100-150+       | 342-513+      |

### Visual Brightness Score

A percentage representing how bright the image appears relative to a reference (18 fL). Higher percentages indicate brighter, more vibrant images.

## 🔗 URL Parameters

Share your setup using these query parameters:

- `size`: Screen size in inches
- `ambient`: Room lighting (pitch_black, dim_living_room, bright_room)
- `nameA`: Name of projector A
- `lumensA`: Brightness of projector A
- `nameB`: Name of projector B
- `lumensB`: Brightness of projector B

Example:
```
https://example.com?size=120&ambient=bright_room&nameA=Epson+5050UB&lumensA=3000&nameB=BenQ+HT3550&lumensB=2000
```

## 📁 Project Structure

```
.
├── app/        # React + Vite application
├── assets/     # Static built assets
└── index.html  # Root HTML entry point
```

### Key Components

- **App.tsx**: Main application component
- **ControlsPanel**: Configuration controls for both projectors
- **Visualization**: Interactive brightness comparison preview
- **ResultsPanel**: Numerical results display
- **PresetsPanel**: Quick-select common scenarios
- **ExportPanel**: Share and export functionality

## 🚀 Deployment

### Netlify

The repository includes a pre-configured `netlify.toml`:

```toml
[build]
  base = "app"
  command = "npm run build"
  publish = "dist"
```

Simply connect your repository to Netlify for automatic deployments.

### Other Platforms

Build the app with `npm run build` and deploy the `app/dist` folder to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style
- Write clean, readable code
- Add tests for new functionality (when test framework is added)
- Keep accessibility in mind

## 📄 License

ProjSim is open-source software licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Radix UI** for their excellent component primitives
- **Tailwind CSS** team for the amazing utility framework
- **Vite** for revolutionizing frontend tooling
- **Recharts** for beautiful data visualization components

## 📞 Contact

Have questions or feedback? Reach out on GitHub or open an issue in the repository.

---

*ProjSim - Making projector brightness comparisons simple and visual.*