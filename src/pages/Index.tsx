import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Bet {
  id: number;
  event: string;
  team1: string;
  team2: string;
  odds1: number;
  odds2: number;
  category: string;
  date: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('bets');
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState<{ [key: number]: number }>({});
  const [userBets, setUserBets] = useState<Array<{ bet: Bet; amount: number; selectedTeam: string; odds: number }>>([]);
  const { toast } = useToast();

  const bets: Bet[] = [
    {
      id: 1,
      event: 'Футбол',
      team1: 'Реал Мадрид',
      team2: 'Барселона',
      odds1: 2.5,
      odds2: 1.8,
      category: 'popular',
      date: '25 окт, 20:00'
    },
    {
      id: 2,
      event: 'Баскетбол',
      team1: 'Lakers',
      team2: 'Warriors',
      odds1: 1.9,
      odds2: 2.1,
      category: 'popular',
      date: '25 окт, 22:30'
    },
    {
      id: 3,
      event: 'Теннис',
      team1: 'Джокович',
      team2: 'Надаль',
      odds1: 1.7,
      odds2: 2.3,
      category: 'live',
      date: 'Сейчас'
    },
    {
      id: 4,
      event: 'Хоккей',
      team1: 'СКА',
      team2: 'ЦСКА',
      odds1: 2.2,
      odds2: 1.95,
      category: 'upcoming',
      date: '26 окт, 19:00'
    }
  ];

  const placeBet = (bet: Bet, team: string, odds: number) => {
    const amount = betAmount[bet.id] || 100;
    
    if (amount > balance) {
      toast({
        title: "Недостаточно средств",
        description: "Пополните баланс для совершения ставки",
        variant: "destructive",
      });
      return;
    }

    setBalance(balance - amount);
    setUserBets([...userBets, { bet, amount, selectedTeam: team, odds }]);
    setBetAmount({ ...betAmount, [bet.id]: 0 });
    
    toast({
      title: "Ставка принята! 🎯",
      description: `${amount}₽ на ${team} с коэф. ${odds}`,
      className: "bg-primary text-primary-foreground",
    });

    setTimeout(() => {
      const isWin = Math.random() > 0.5;
      if (isWin) {
        const winAmount = Math.round(amount * odds);
        setBalance(prev => prev + winAmount);
        toast({
          title: "Поздравляем! 🎉",
          description: `Вы выиграли ${winAmount}₽`,
          className: "bg-secondary text-secondary-foreground",
        });
      } else {
        toast({
          title: "Событие завершено",
          description: `К сожалению, ставка не сыграла`,
          variant: "destructive",
        });
      }
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <header className="border-b border-border/50 backdrop-blur-lg bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse-glow">
                <Icon name="Trophy" size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                BetPlatform
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Баланс</p>
                <p className="text-xl font-bold font-heading text-foreground">{balance}₽</p>
              </div>
              <Avatar className="ring-2 ring-primary/30">
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold">
                  US
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 h-12 bg-card/50 backdrop-blur">
            <TabsTrigger value="bets" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Target" size={18} className="mr-2" />
              Ставки
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="User" size={18} className="mr-2" />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="rules" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="BookOpen" size={18} className="mr-2" />
              Правила
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bets" className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge variant="outline" className="px-4 py-2 bg-primary/10 border-primary/30 text-primary cursor-pointer hover:bg-primary/20 transition-colors">
                🔥 Популярное
              </Badge>
              <Badge variant="outline" className="px-4 py-2 bg-secondary/10 border-secondary/30 text-secondary cursor-pointer hover:bg-secondary/20 transition-colors">
                🎯 Live
              </Badge>
              <Badge variant="outline" className="px-4 py-2 bg-muted/50 border-muted text-muted-foreground cursor-pointer hover:bg-muted transition-colors">
                ⏰ Скоро
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {bets.map((bet) => (
                <Card 
                  key={bet.id} 
                  className="overflow-hidden border-border/50 bg-card/50 backdrop-blur hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 animate-scale-in"
                >
                  <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="mb-2 bg-primary/20 text-primary border-primary/30">
                          {bet.event}
                        </Badge>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Icon name="Clock" size={14} />
                          {bet.date}
                        </p>
                      </div>
                      {bet.category === 'live' && (
                        <Badge className="bg-secondary animate-pulse">
                          <Icon name="Radio" size={12} className="mr-1" />
                          LIVE
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3 items-center">
                      <div className="text-center">
                        <p className="font-heading font-semibold text-foreground mb-2">{bet.team1}</p>
                        <Button
                          onClick={() => placeBet(bet, bet.team1, bet.odds1)}
                          className="w-full bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 font-bold text-lg h-12"
                        >
                          {bet.odds1}
                        </Button>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl mb-2">⚡</div>
                        <p className="text-xs text-muted-foreground">VS</p>
                      </div>

                      <div className="text-center">
                        <p className="font-heading font-semibold text-foreground mb-2">{bet.team2}</p>
                        <Button
                          onClick={() => placeBet(bet, bet.team2, bet.odds2)}
                          className="w-full bg-gradient-to-br from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 font-bold text-lg h-12"
                        >
                          {bet.odds2}
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <label className="text-xs text-muted-foreground mb-2 block">Сумма ставки</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={betAmount[bet.id] || ''}
                          onChange={(e) => setBetAmount({ ...betAmount, [bet.id]: Number(e.target.value) })}
                          placeholder="100"
                          className="flex-1 px-4 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setBetAmount({ ...betAmount, [bet.id]: 100 })}
                          className="border-primary/30 hover:bg-primary/10"
                        >
                          100₽
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setBetAmount({ ...betAmount, [bet.id]: 500 })}
                          className="border-primary/30 hover:bg-primary/10"
                        >
                          500₽
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 animate-fade-in">
            <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border/50">
              <CardContent className="p-8">
                <div className="flex items-center gap-6 mb-8">
                  <Avatar className="w-24 h-24 ring-4 ring-primary/30">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-3xl font-bold">
                      US
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-3xl font-heading font-bold text-foreground mb-2">Игрок #12345</h2>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      <Icon name="Star" size={14} className="mr-1" />
                      VIP Статус
                    </Badge>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-background/50 backdrop-blur rounded-xl p-6 border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Баланс</p>
                      <Icon name="Wallet" size={20} className="text-primary" />
                    </div>
                    <p className="text-3xl font-heading font-bold text-foreground">{balance}₽</p>
                  </div>

                  <div className="bg-background/50 backdrop-blur rounded-xl p-6 border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Всего ставок</p>
                      <Icon name="TrendingUp" size={20} className="text-secondary" />
                    </div>
                    <p className="text-3xl font-heading font-bold text-foreground">{userBets.length}</p>
                  </div>

                  <div className="bg-background/50 backdrop-blur rounded-xl p-6 border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Успешных</p>
                      <Icon name="Award" size={20} className="text-primary" />
                    </div>
                    <p className="text-3xl font-heading font-bold text-foreground">
                      {Math.floor(userBets.length * 0.6)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                  <Icon name="History" size={24} className="text-primary" />
                  История ставок
                </h3>
                {userBets.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="Inbox" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Вы еще не сделали ни одной ставки</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userBets.map((userBet, index) => (
                      <div 
                        key={index}
                        className="flex justify-between items-center p-4 bg-background/50 rounded-lg border border-border/50 hover:bg-background/80 transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-foreground">{userBet.selectedTeam}</p>
                          <p className="text-sm text-muted-foreground">{userBet.bet.event}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{userBet.amount}₽</p>
                          <p className="text-xs text-muted-foreground">Коэф. {userBet.odds}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="animate-fade-in">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-3xl font-heading font-bold text-foreground mb-6 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Icon name="BookOpen" size={24} className="text-white" />
                  </div>
                  Правила платформы
                </h2>

                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="item-1" className="bg-background/50 rounded-lg border border-border/50 px-6">
                    <AccordionTrigger className="text-lg font-heading hover:text-primary">
                      Как делать ставки?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Выберите событие, укажите сумму ставки и нажмите на кнопку с коэффициентом команды, на которую хотите поставить. 
                      Ставка будет принята автоматически, а результат вы узнаете через уведомление.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="bg-background/50 rounded-lg border border-border/50 px-6">
                    <AccordionTrigger className="text-lg font-heading hover:text-primary">
                      Как работают коэффициенты?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Коэффициент показывает, во сколько раз увеличится ваша ставка в случае выигрыша. 
                      Например, ставка 100₽ с коэффициентом 2.5 принесет 250₽ при победе.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="bg-background/50 rounded-lg border border-border/50 px-6">
                    <AccordionTrigger className="text-lg font-heading hover:text-primary">
                      Когда приходят уведомления?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Вы получите push-уведомление сразу после завершения события и определения результата вашей ставки. 
                      Также уведомления приходят о новых горячих событиях и специальных предложениях.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="bg-background/50 rounded-lg border border-border/50 px-6">
                    <AccordionTrigger className="text-lg font-heading hover:text-primary">
                      Минимальная сумма ставки
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Минимальная сумма ставки составляет 10₽. Максимальная сумма зависит от вашего статуса и баланса счета.
                      VIP-игроки имеют повышенные лимиты.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5" className="bg-background/50 rounded-lg border border-border/50 px-6">
                    <AccordionTrigger className="text-lg font-heading hover:text-primary">
                      Ответственная игра
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Мы призываем к ответственному подходу к ставкам. Устанавливайте личные лимиты, делайте перерывы 
                      и никогда не ставьте больше, чем можете себе позволить потерять. 
                      Ставки должны быть развлечением, а не способом заработка.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/30">
                  <div className="flex items-start gap-4">
                    <Icon name="Shield" size={32} className="text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-heading font-bold text-foreground mb-2">Безопасность и честность</h3>
                      <p className="text-sm text-muted-foreground">
                        Все события проверяются независимыми источниками. Мы гарантируем честные результаты 
                        и защиту ваших данных. Платформа использует современные технологии шифрования.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border/50 mt-16 py-8 bg-card/30 backdrop-blur">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <Icon name="Shield" size={16} />
            BetPlatform © 2024 — Ставки с умом
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
