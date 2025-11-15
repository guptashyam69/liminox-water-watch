import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Zap } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero Section */}
      <section className="px-4 py-12">
        <div className="container mx-auto max-w-4xl text-center space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
          <h1 className="text-5xl md:text-6xl font-bold">
            About <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Liminox</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Leading the way in smart water management technology
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-12">
        <div className="container mx-auto max-w-5xl">
          <Card className="border-border animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
                At Liminox, we believe that water is our most precious resource. Our mission is
                to empower individuals, businesses, and communities with cutting-edge technology
                to monitor, conserve, and optimize water usage. Through innovation and
                sustainability, we're building a future where every drop counts.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4 py-12">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 animate-in fade-in slide-in-from-bottom duration-700">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Innovation",
                description:
                  "We continuously push the boundaries of water monitoring technology to deliver state-of-the-art solutions that anticipate future needs.",
              },
              {
                icon: Users,
                title: "Customer Focus",
                description:
                  "Our customers are at the heart of everything we do. We listen, adapt, and deliver solutions that truly make a difference.",
              },
              {
                icon: Zap,
                title: "Sustainability",
                description:
                  "We're committed to environmental responsibility, helping reduce water waste and promoting conservation for future generations.",
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-8 space-y-4 text-center">
                  <div className="w-16 h-16 mx-auto rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="px-4 py-12">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-border bg-accent/30 animate-in fade-in slide-in-from-bottom duration-700">
            <CardContent className="p-8 md:p-12 space-y-6">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2020, Liminox was born from a simple observation: too much water
                  was being wasted due to inefficient monitoring and outdated infrastructure.
                  Our founders, a team of engineers and environmental scientists, set out to
                  create a solution that would make water management accessible, affordable, and
                  effective for everyone.
                </p>
                <p>
                  Today, Liminox serves thousands of customers worldwide, from residential homes
                  to large industrial facilities. Our smart monitoring systems have helped save
                  millions of gallons of water and prevented countless costly leaks. But we're
                  just getting started.
                </p>
                <p>
                  As we continue to grow, our commitment remains unchanged: to provide the most
                  advanced, reliable, and user-friendly water monitoring solutions on the market,
                  while making a positive impact on our planet's most vital resource.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;
