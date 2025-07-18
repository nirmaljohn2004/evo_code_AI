import Dashboard from "@/components/Dashboard"

const mockUser = {
  id: 1,
  name: "Alex Johnson",
  email: "alex@example.com",
  level: 5,
  xp: 1250,
  streak: 7,
  badges: ["first-steps", "code-warrior"],
  completedLessons: [1, 2, 3],
}

export default function Home() {
  return <Dashboard user={mockUser} />
}
