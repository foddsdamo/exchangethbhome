export function Features() {
  const features = [
    {
      icon: "⚡",
      title: "Real-time Data",
      description: "Prices updated automatically every 5 seconds from all major Thai exchanges for maximum accuracy",
      iconBg: "bg-teal-500"
    },
    {
      icon: "🎯", 
      title: "Easy to Use",
      description: "Compare prices across all exchanges in one simple interface. No need to visit multiple sites",
      iconBg: "bg-pink-500"
    },
    {
      icon: "🔒",
      title: "Safe & Secure",
      description: "Read-only data access. We never store your personal information or trading credentials",
      iconBg: "bg-orange-500"
    }
  ];

  return (
    <section className="bg-[#1a1b23] px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-white text-3xl text-center mb-12">Why Choose Us</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 ${feature.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <span className="text-2xl">{feature.icon}</span>
              </div>
              
              <h3 className="text-white text-xl mb-4">{feature.title}</h3>
              
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}