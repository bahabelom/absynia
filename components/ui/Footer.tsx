import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-white py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary">AI Mentor Ethiopia</h3>
                        <p className="text-sm text-gray-500">
                            Empowering Ethiopian students with AI-driven learning tools.
                        </p>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold">Platform</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-primary">Features</Link></li>
                            <li><Link href="#" className="hover:text-primary">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-primary">For Schools</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-primary">About Us</Link></li>
                            <li><Link href="#" className="hover:text-primary">Careers</Link></li>
                            <li><Link href="#" className="hover:text-primary">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold">Partners</h4>
                        <p className="text-sm text-gray-500">
                            Powered by <span className="font-medium text-foreground">Google Cloud Vertex AI</span>
                        </p>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-100 pt-8 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} AI Mentor Ethiopia. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
