import { CommonModule, DOCUMENT, NgClass } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConfigService } from '@config';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { LanguageService, InConfiguration, AuthService } from '@core';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatMenuModule } from '@angular/material/menu';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatButtonModule } from '@angular/material/button';
import { CookieService } from 'ngx-cookie-service';
import { NotifcationServiceService } from './Notifcation.service';
import { CreateNotificationsDto } from './createNotifications.dto';

interface Notifications {
  message: string;
  time: string;
  icon: string;
  color: string;
  status: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    MatButtonModule,
    FeatherIconsComponent,
    MatMenuModule,
    NgScrollbar,
    CommonModule
  ],
})
export class HeaderComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  public config!: InConfiguration;
  userImg?: string;
  homePage?: string;
  isNavbarCollapsed = true;
  flagvalue: string | string[] | undefined;
  countryName: string | string[] = [];
  langStoreValue?: string;
  defaultFlag?: string;
  isOpenSidebar?: boolean;
  docElement?: HTMLElement;
  isFullScreen = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private configService: ConfigService,
    private authService: AuthService,
    private router: Router,
    public languageService: LanguageService,
    private cookieService: CookieService,
    private notificationService : NotifcationServiceService

  ) {
    super();
  }
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
  ];
  notifications: any[] = [];
  notificationsCount: string = ''; 

  userData: any; 
  ngOnInit() {
    const cookieData = this.cookieService.get('user_data');
    if (cookieData) {
      this.userData = JSON.parse(cookieData);
    }
    this.notificationService.notificationListener().subscribe({
      next: (notification: any) => {
        this.notificationService.getNotifications().subscribe({
          next: (notifications) => {
            this.notifications = notifications;
            console.log(notifications)
            // Mettez à jour ici pour compter seulement les notifications non vues
            this.updateNotificationsCount();
          },
          error: (err) => console.error(err)
        });
        this.notifications.unshift(notification); // Add the new notification to the beginning of the list
        this.updateNotificationsCount(true);
        console.log("jjbhuftf" , notification)
      },
      error: (err) => console.error(err)
    });
  }
  openNotifications() {
    this.notificationsCount = ''; // Réinitialise le compteur à une chaîne vide
    // Marquer toutes les notifications comme vues ici
    this.markNotificationsAsSeen();
  }
  updateNotificationsCount(isNew: boolean = false) {
    if(isNew) {
      // Incrémenter le compteur pour une nouvelle notification
      const count = parseInt(this.notificationsCount || '0', 10);
      this.notificationsCount = (count + 1).toString();
    } else {
      // Compter seulement les notifications non vues pour l'initialisation
      const unseenCount = this.notifications.filter(not => !not.isSeen).length;
      this.notificationsCount = unseenCount > 0 ? unseenCount.toString() : '';
    }
  }
  markNotificationsAsSeen() {
    // Mettez à jour vos notifications pour les marquer comme vues, par exemple, en faisant une requête PATCH au serveur
    // Supposons que le serveur marque toutes les notifications comme vues et renvoie le total des notifications mises à jour
    this.notificationService.updateUnseenNotificationByIds({notifications_ids: this.notifications.filter(not => !not.isSeen).map(not => not._id)}).subscribe(() => {
      this.notifications.forEach(not => not.isSeen = true);
      this.notificationsCount = ''; // Assurez-vous que le compteur est réinitialisé après la mise à jour
    });
  }


  callFullscreen() {
    if (!this.isFullScreen) {
      const docElement = document.documentElement;
      if (docElement?.requestFullscreen != null) {
        docElement?.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen != null) {
        document.exitFullscreen();
      }
    }
    this.isFullScreen = !this.isFullScreen;
  }
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.langStoreValue = lang;
    this.languageService.setLanguage(lang);
  }
  mobileMenuSidebarOpen(event: Event, className: string) {
    const hasClass = (event.target as HTMLInputElement).classList.contains(
      className
    );
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }
  }
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'false');
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'true');
    }
  }
  logout() {
   this.authService.logout();
  }


}
