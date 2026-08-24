package com.petadoption.portal.config;

import com.petadoption.portal.entity.AdoptionRequest;
import com.petadoption.portal.entity.Pet;
import com.petadoption.portal.entity.PetImage;
import com.petadoption.portal.entity.User;
import com.petadoption.portal.enums.AdoptionRequestStatus;
import com.petadoption.portal.enums.Availability;
import com.petadoption.portal.enums.Gender;
import com.petadoption.portal.enums.HealthStatus;
import com.petadoption.portal.enums.Role;
import com.petadoption.portal.enums.Species;
import com.petadoption.portal.enums.UserStatus;
import com.petadoption.portal.repository.AdoptionRequestRepository;
import com.petadoption.portal.repository.PetRepository;
import com.petadoption.portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("!test")
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    public static final String DEMO_PASSWORD = "Demo@123";

    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final AdoptionRequestRepository adoptionRequestRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.existsByEmailIgnoreCase("admin@example.com")) {
            log.debug("Demo data already present, skipping seed");
            return;
        }

        String encoded = passwordEncoder.encode(DEMO_PASSWORD);
        User admin = saveUser("Portal Admin", "admin@example.com", encoded, "9000000001", "Lucknow", Role.ADMIN);
        User owner = saveUser("Sunrise Shelter", "owner@example.com", encoded, "9000000002", "Lucknow", Role.OWNER);
        User adopter = saveUser("Avanish Adopter", "adopter@example.com", encoded, "9000000003", "Lucknow", Role.ADOPTER);
        User ownerTwo = saveUser("Paws & Care", "shelter2@example.com", encoded, "9000000004", "Delhi", Role.OWNER);
        User adopterTwo = saveUser("Riya Sharma", "riya@example.com", encoded, "9000000005", "Kanpur", Role.ADOPTER);

        Pet luna = savePet(owner, "Luna", Species.DOG, "Indie", 2, Gender.FEMALE, HealthStatus.VACCINATED,
                "Lucknow", "A gentle indie who loves evening walks and quiet homes.", Availability.AVAILABLE,
                "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80");
        savePet(owner, "Milo", Species.CAT, "Domestic Shorthair", 1, Gender.MALE, HealthStatus.HEALTHY,
                "Lucknow", "Playful kitten who follows you from room to room.", Availability.AVAILABLE,
                "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80");
        savePet(owner, "Coco", Species.DOG, "Labrador Mix", 4, Gender.FEMALE, HealthStatus.VACCINATED,
                "Kanpur", "Family-friendly lab mix, great with children.", Availability.AVAILABLE,
                "https://images.unsplash.com/photo-1543466835-00a7907a9d9d?auto=format&fit=crop&w=800&q=80");
        Pet kiwi = savePet(owner, "Kiwi", Species.OTHER, "Rabbit", 1, Gender.FEMALE, HealthStatus.HEALTHY,
                "Lucknow", "Curious rabbit who enjoys leafy greens and lap time.", Availability.AVAILABLE,
                "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80");
        savePet(owner, "Bruno", Species.DOG, "German Shepherd Mix", 5, Gender.MALE, HealthStatus.UNDER_TREATMENT,
                "Lucknow", "Loyal shepherd recovering well and looking for a patient family.", Availability.PENDING,
                "https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&w=800&q=80");
        savePet(owner, "Simba", Species.CAT, "Persian Mix", 3, Gender.MALE, HealthStatus.VACCINATED,
                "Varanasi", "Calm cat who prefers sunny windows and slow mornings.", Availability.AVAILABLE,
                "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80");
        savePet(ownerTwo, "Daisy", Species.DOG, "Beagle", 2, Gender.FEMALE, HealthStatus.HEALTHY,
                "Delhi", "Energetic beagle who needs a backyard and lots of sniff walks.", Availability.AVAILABLE,
                "https://images.unsplash.com/photo-1505628346881-b72b40eaa71b?auto=format&fit=crop&w=800&q=80");
        savePet(ownerTwo, "Shadow", Species.CAT, "Bombay", 4, Gender.MALE, HealthStatus.VACCINATED,
                "Delhi", "Velvet-black cat with a surprisingly loud purr.", Availability.AVAILABLE,
                "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=800&q=80");
        savePet(ownerTwo, "Noodle", Species.OTHER, "Guinea Pig", 1, Gender.UNKNOWN, HealthStatus.HEALTHY,
                "Noida", "Tiny chatterbox who loves cucumber slices.", Availability.AVAILABLE,
                "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80");
        Pet ginger = savePet(ownerTwo, "Ginger", Species.DOG, "Golden Retriever", 6, Gender.FEMALE, HealthStatus.VACCINATED,
                "Delhi", "Senior golden with a heart of gold. Already found her forever home.", Availability.ADOPTED,
                "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=800&q=80");
        savePet(ownerTwo, "Pepper", Species.CAT, "Siamese Mix", 2, Gender.FEMALE, HealthStatus.OTHER,
                "Gurugram", "Talkative and smart; best in a calm indoor home.", Availability.AVAILABLE,
                "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=800&q=80");
        savePet(owner, "Rocky", Species.DOG, "Indie", 3, Gender.MALE, HealthStatus.HEALTHY,
                "Prayagraj", "Street-smart indie who already knows sit and paw.", Availability.AVAILABLE,
                "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80");
        savePet(owner, "Misty", Species.CAT, "Domestic Longhair", 7, Gender.FEMALE, HealthStatus.VACCINATED,
                "Lucknow", "Quiet companion cat, perfect for apartments.", Availability.INACTIVE,
                "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=800&q=80");
        savePet(ownerTwo, "Oreo", Species.DOG, "Pug Mix", 2, Gender.MALE, HealthStatus.HEALTHY,
                "Delhi", "Compact snuggler who snores like a champion.", Availability.AVAILABLE,
                "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80");
        savePet(owner, "Bella", Species.DOG, "Spitz", 1, Gender.FEMALE, HealthStatus.VACCINATED,
                "Lucknow", "Fluffy youngster looking for her first family.", Availability.AVAILABLE,
                "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80");

        adoptionRequestRepository.save(AdoptionRequest.builder()
                .pet(luna)
                .adopter(adopter)
                .message("I work from home and can give Luna daily walks and lots of attention.")
                .status(AdoptionRequestStatus.PENDING)
                .build());
        adoptionRequestRepository.save(AdoptionRequest.builder()
                .pet(kiwi)
                .adopter(adopterTwo)
                .message("I already keep small pets and have a safe indoor enclosure ready.")
                .status(AdoptionRequestStatus.PENDING)
                .build());
        adoptionRequestRepository.save(AdoptionRequest.builder()
                .pet(ginger)
                .adopter(adopter)
                .message("I would love to give Ginger a calm retirement home.")
                .status(AdoptionRequestStatus.APPROVED)
                .build());

        log.info("Seeded demo users, pets and adoption requests. Demo password is documented in README.");
        log.debug("Seeded adminId={} ownerId={} adopterId={}", admin.getId(), owner.getId(), adopter.getId());
    }

    private User saveUser(String name, String email, String password, String phone, String location, Role role) {
        return userRepository.save(User.builder()
                .name(name)
                .email(email)
                .password(password)
                .phone(phone)
                .location(location)
                .role(role)
                .status(UserStatus.ACTIVE)
                .build());
    }

    private Pet savePet(
            User owner,
            String name,
            Species species,
            String breed,
            int age,
            Gender gender,
            HealthStatus healthStatus,
            String location,
            String description,
            Availability availability,
            String imageUrl) {
        Pet pet = Pet.builder()
                .owner(owner)
                .name(name)
                .species(species)
                .breed(breed)
                .age(age)
                .gender(gender)
                .healthStatus(healthStatus)
                .location(location)
                .description(description)
                .availability(availability)
                .build();
        pet.addImage(PetImage.builder().imageUrl(imageUrl).primaryImage(true).build());
        return petRepository.save(pet);
    }
}
