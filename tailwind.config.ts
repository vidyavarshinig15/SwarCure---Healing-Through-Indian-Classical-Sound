import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'sans': ['Inter', 'system-ui', 'sans-serif'],
				'hindi': ['Noto Sans Devanagari', 'Inter', 'sans-serif'],
				'calm': ['Inter', 'Noto Sans Devanagari', 'sans-serif'],
				'indian': ['Inter', 'Noto Sans Devanagari', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#3D52A0',
					foreground: '#EDE8F5'
				},
				secondary: {
					DEFAULT: '#7091E6',
					foreground: '#EDE8F5'
				},
				tertiary: {
					DEFAULT: '#8697C4',
					foreground: '#EDE8F5'
				},
				accent: {
					DEFAULT: '#ADBBDA',
					foreground: '#3D52A0'
				},
				muted: {
					DEFAULT: '#EDE8F5',
					foreground: '#3D52A0'
				},
				destructive: {
					DEFAULT: 'hsl(0 84.2% 60.2%)',
					foreground: 'hsl(210 40% 98%)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				indian: {
					gold: '#D4AF37',
					copper: '#B87333',
					saffron: '#FF9933',
					vermillion: '#E34234',
					turmeric: '#E1AD21',
					sandalwood: '#F4A460'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-8px)' }
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 4s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
				'fade-in-up': 'fade-in-up 0.8s ease-out'
			},
			backgroundImage: {
				'indian-pattern': 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ADBBDA" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="3"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
				'gradient-indian': 'linear-gradient(135deg, #EDE8F5 0%, #ADBBDA 25%, #8697C4 50%, #7091E6 75%, #3D52A0 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
